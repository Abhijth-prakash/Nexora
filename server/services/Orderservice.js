const Cart = require("../models/Cart")
const logger = require("../utils/logger")
const { NotFoundError, ConflictError,ValidationError, AuthenticationError } = require("../utils/errors");
const { Coupon,CouponRedemption } = require("../models/Coupon");
const Address = require("../models/Address");
const CartService = require("./cartService");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const StockReservation = require("../models/StockReservation");
const razorpay = require("../config/razorpay");
const Order = require("../models/Order");
const config = require('../config/config')
const crypto = require("crypto");
const User = require("../models/User");
const Mail = require('../utils/mail')
const Wallet = require('../models/Wallet')
const WalletService = require('./Walletservice')

class OrderService{

    //stockvalidation
   static async StockValidation(user, buyNowItem = null) {
    try {
        if (buyNowItem) {
            const { productId, variantId, quantity = 1, size = null } = buyNowItem;

            if (!productId || !mongoose.isValidObjectId(productId)) {
                throw new ValidationError("Invalid product id");
            }
            if (variantId && !mongoose.isValidObjectId(variantId)) {
                throw new ValidationError("Invalid variant id");
            }

            const qty = Math.max(1, parseInt(quantity, 10) || 1);

            const product = await Product.findOne({ _id: productId, visible: true });
            if (!product) {
                throw new NotFoundError("Product not found");
            }

            let availableStock = product.stock;
            let validSizes = product.size;

            if (variantId) {
                const variant = product.variants.id(variantId);
                if (!variant) {
                    throw new NotFoundError(`Variant not found for ${product.name}`);
                }
                availableStock = variant.stock;
                validSizes = variant.size?.length > 0 ? variant.size : product.size;
            }

            if (validSizes && validSizes.length > 0 && size) {
                if (!validSizes.includes(size)) {
                    throw new ValidationError("Please select a valid size");
                }
            }

            if (availableStock < qty) {
                throw new ConflictError(
                    `Insufficient stock for ${product.name}. Available: ${availableStock}, Requested: ${qty}`
                );
            }

            logger.info("Stock validation successful for buy now item", {
                productId,
                variantId,
                quantity: qty,
            });

            return {
                items: [
                    {
                        product,
                        variantId: variantId || null,
                        quantity: qty,
                        size: size || null,
                    },
                ],
            };
        }

        const cart = await Cart.findOne({
            user: user
        }).populate("items.product");

        if (!cart) {
            throw new NotFoundError("Cart not found");
        }

        if (!cart.items.length) {
            throw new ConflictError("Your cart is empty");
        }

        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                throw new NotFoundError("Product not found");
            }

            let availableStock;

            if (item.variantId) {
                const variant = product.variants.id(item.variantId);

                if (!variant) {
                    throw new NotFoundError(
                        `Variant not found for ${product.name}`
                    );
                }

                availableStock = variant.stock;
            } else {
                availableStock = product.stock;
            }

            if (availableStock < item.quantity) {
                throw new ConflictError(
                    `Insufficient stock for ${product.name}. Available: ${availableStock}, Requested: ${item.quantity}`
                );
            }
        }


        logger.info('stock validation succesfull')
        return cart;
    
    } catch (error) {
        logger.error("Failed to place the order", { error });
        throw error;
    }
}



    //order summary
  static async orderSummary(user, couponId, buyNowItem = null) {
  try {
    let subtotal = 0;
    let itemsForSummary = [];

    if (buyNowItem) {
      const { productId, variantId, quantity = 1, size = null } = buyNowItem;

      if (!productId || !mongoose.isValidObjectId(productId)) {
        throw new ValidationError("Invalid product id");
      }
      if (variantId && !mongoose.isValidObjectId(variantId)) {
        throw new ValidationError("Invalid variant id");
      }

      const qty = Math.max(1, parseInt(quantity, 10) || 1);

      const product = await Product.findOne({ _id: productId, visible: true });
      if (!product) {
        throw new NotFoundError("Product not found");
      }

      let unitPrice = product.price;
      let variant = null;

      if (variantId) {
        variant = product.variants.id(variantId);
        if (!variant) {
          throw new NotFoundError("Variant not found");
        }
        unitPrice = variant.price;
      }

      subtotal = unitPrice * qty;

      itemsForSummary = [
        {
          _id: product._id,
          productId: product._id,
          variantId: variantId || null,
          name: product.name,
          brand: product.brand,
          color: variant?.color || product.color || null,
          price: unitPrice,
          quantity: qty,
          size: size || null,
          category: product.category,
          image:
            (variant?.images?.length ? variant.images[0] : product.images?.[0]) ||
            null,
          lineTotal: unitPrice * qty,
        },
      ];
    } else {
      const cart = await Cart.findOne({ user }).populate("items.product");

      if (!cart) {
        throw new NotFoundError("Cart not found");
      }

      // Calculate subtotal
      subtotal = cart.items.reduce((total, item) => {
        const product = item.product;

        if (!product) {
          throw new NotFoundError("Product in cart not found");
        }

        let price = product.price;
        if (item.variantId) {
          const variant = product.variants.id(item.variantId);
          if (variant) {
            price = variant.price;
          }
        }

        return total + price * item.quantity;
      }, 0);
    }

    let discount = 0;
    let finalAmount = subtotal;
    let coupon = null;

    if (couponId) {
      coupon = await Coupon.findById(couponId);

      if (!coupon) {
        throw new NotFoundError("Coupon not found");
      }

      // Validate coupon state
      const now = new Date();
      if (!coupon.isActive) {
        throw new ValidationError("Coupon is inactive");
      }
      if (coupon.startDate > now) {
        throw new ValidationError("Coupon is not active yet");
      }
      if (coupon.expiryDate < now) {
        throw new ValidationError("Coupon has expired");
      }
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new ConflictError("Coupon usage limit has been reached");
      }

      const redemptionCount = await CouponRedemption.countDocuments({
        coupon: coupon._id,
        user: user,
      });

      if (redemptionCount >= coupon.perUserLimit) {
        throw new ConflictError(
          "You have already reached the usage limit for this coupon"
        );
      }

      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        throw new ValidationError(
          `Minimum order amount of ₹${coupon.minOrderAmount} is required to use this coupon`
        );
      }

      // Check applicable categories
      if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
        let categoriesToCheck = [];
        if (buyNowItem) {
          const prod = itemsForSummary[0];
          if (prod && prod.category) {
            categoriesToCheck.push(prod.category.toString());
          }
        } else {
          const cart = await Cart.findOne({ user }).populate("items.product");
          if (cart) {
            categoriesToCheck = cart.items
              .map((i) => i.product?.category?.toString())
              .filter(Boolean);
          }
        }

        const isApplicable = categoriesToCheck.some((catId) =>
          coupon.applicableCategories.some(
            (appCat) => appCat.toString() === catId
          )
        );

        if (!isApplicable) {
          throw new ConflictError(
            "Coupon is not applicable to items in your order"
          );
        }
      }

      // Calculate discount
      if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.discountValue) / 100;

        if (coupon.maxDiscount !== null) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = coupon.discountValue;
      }

      // Discount cannot exceed subtotal
      discount = Math.min(discount, subtotal);
      discount = Math.round(discount * 100) / 100;

      finalAmount = subtotal - discount;
    }

    return {
      subtotal,
      discount,
      finalAmount,
      coupon: coupon
        ? {
            _id: coupon._id,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
          }
        : null,
      ...(buyNowItem ? { items: itemsForSummary } : {}),
    };
  } catch (error) {
    logger.error("Failed to calculate order summary", { error });
    throw error;
  }
}


//release the user's existing active reservations
static async releaseUserReservations(user) {
  const session = await mongoose.startSession();
  const released = []; // CHANGED: collects released reservations for logging

  try {
    await session.withTransaction(async () => {
      released.length = 0; // reset in case the transaction is retried

      let reservation;

      // findOneAndDelete is atomic, so stock is restored only once
      while (
        (reservation = await StockReservation.findOneAndDelete(
          { user, status: "reserved" },
          { session }
        ))
      ) {
        for (const item of reservation.items) {
          let result;

          if (item.variantId) {
            result = await Product.updateOne(
              {
                _id: item.product,
                "variants._id": item.variantId,
              },
              {
                $inc: {
                  "variants.$.stock": item.quantity,
                },
              },
              { session }
            );
          } else {
            result = await Product.updateOne(
              { _id: item.product },
              { $inc: { stock: item.quantity } },
              { session }
            );
          }

          if (result.modifiedCount !== 1) {
            throw new Error(
              `Failed to restore stock for product ${item.product}`
            );
          }
        }

        released.push({
          reservationId: reservation._id,
          items: reservation.items,
        });
      }
    });

    // CHANGED: log only after the transaction has committed
    for (const r of released) {
      logger.info("Previous reservation released and stock restored", {
        user,
        reservationId: r.reservationId,
        items: r.items,
      });
    }
  } catch (error) {
    logger.error("Failed to release previous reservations", { error });
    throw error;
  } finally {
    await session.endSession();
  }
}





//generateorder
static async GenerateOrder(user, data) {
  const session = await mongoose.startSession();

  try {
    const { addressId, couponId, isBuyNow, buyNowItem } = data;

    if (!mongoose.isValidObjectId(addressId)) {
      throw new ValidationError("Invalid address");
    }
    if (couponId && !mongoose.isValidObjectId(couponId)) {
      throw new ValidationError("Invalid coupon");
    }

    // ---- Lookups ----
    const address = await Address.findOne({ _id: addressId, user });
    if (!address) {
      throw new NotFoundError("Address not found");
    }

    await this.releaseUserReservations(user);

    const checkoutData = isBuyNow
      ? await this.StockValidation(user, buyNowItem)
      : await this.StockValidation(user);

    if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0) {
      throw new ValidationError(
        isBuyNow ? "Invalid Buy Now item" : "Your cart is empty"
      );
    }

    const summary = isBuyNow
      ? await this.orderSummary(user, couponId, buyNowItem)
      : await this.orderSummary(user, couponId);

    if (!summary || !(summary.finalAmount > 0)) {
      throw new ValidationError("Invalid order amount");
    }

    const reservationId = new mongoose.Types.ObjectId();
    const orderId = new mongoose.Types.ObjectId();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const reservationItems = [];
    const orderItems = [];

    await session.withTransaction(async () => {
      reservationItems.length = 0;
      orderItems.length = 0;

      for (const item of checkoutData.items) {
        const product = item.product;
        if (!product) {
          throw new NotFoundError("Product not found");
        }

        const quantity = item.quantity;
        let stockUpdate;
        let price;

        if (item.variantId) {
          const variant = product.variants.id(item.variantId);
          if (!variant) {
            throw new NotFoundError("Variant not found");
          }
          price = variant.price;

          stockUpdate = await Product.updateOne(
            {
              _id: product._id,
              variants: {
                $elemMatch: {
                  _id: item.variantId,
                  stock: { $gte: quantity },
                },
              },
            },
            { $inc: { "variants.$.stock": -quantity } },
            { session }
          );
        } else {
          price = product.price;

          stockUpdate = await Product.updateOne(
            { _id: product._id, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { session }
          );
        }

        if (stockUpdate.modifiedCount !== 1) {
          throw new ConflictError(
            `Insufficient stock for ${product.name}. Please try again.`
          );
        }

        reservationItems.push({
          product: product._id,
          variantId: item.variantId || null,
          quantity,
        });

        orderItems.push({
          product: product._id,
          variantId: item.variantId || null,
          quantity,
          price,
        });
      }

      await StockReservation.create(
        [
          {
            _id: reservationId,
            user,
            items: reservationItems,
            totalAmount: summary.finalAmount,
            coupon: summary.coupon?._id,
            orderId,
            status: "reserved",
            expiresAt,
          },
        ],
        { session }
      );

      await Order.create(
        [
          {
            _id: orderId,
            user,
            items: orderItems,
            address: addressId,
            totalAmount: summary.finalAmount,
            coupon: summary.coupon?._id || null,
            paymentStatus: "pending",
            subtotal: summary.subtotal,
            discountAmount: summary.discount,
            isBuyNow: Boolean(isBuyNow),
          },
        ],
        { session }
      );
    });

    logger.info("Stock reserved and order created", {
      user,
      reservationId,
      orderId,
      expiresAt,
      isBuyNow: Boolean(isBuyNow),
    });

    return {
      orderId,
      reservationId,
      expiresAt,
      address,
      summary,
      user,
    };
  } catch (error) {
    logger.error("Failed to verify checkout details", { error });
    throw error;
  } finally {
    await session.endSession();
  }
}




//delete expired
static async expireReservation(reservationId) {
  const session = await mongoose.startSession();
  let expired = null;

  try {
    await session.withTransaction(async () => {
      expired = null;

      const reservation = await StockReservation.findOne({
        _id: reservationId,
        status: "reserved",
        expiresAt: { $lte: new Date() },
      }).session(session);

      if (!reservation) return;

      const deleted = await StockReservation.deleteOne({
        _id: reservationId,
        status: "reserved",
        expiresAt: { $lte: new Date() },
      }).session(session);

      if (deleted.deletedCount !== 1) return;

      // Restore the reserved stock
      for (const item of reservation.items) {
        const result = item.variantId
          ? await Product.updateOne(
              { _id: item.product, "variants._id": item.variantId },
              { $inc: { "variants.$.stock": item.quantity } },
              { session }
            )
          : await Product.updateOne(
              { _id: item.product },
              { $inc: { stock: item.quantity } },
              { session }
            );

        if (result.modifiedCount !== 1) {
          throw new Error(`Failed to restore stock for product ${item.product}`);
        }
      }

      // Cancel the unpaid order linked to this reservation
      if (reservation.orderId) {
        await Order.updateOne(
          {
            _id: reservation.orderId,
            paymentStatus: "pending",
            orderStatus: { $ne: "cancelled" },
          },
          {
            $set: {
              orderStatus: "cancelled",
              cancelReason: "Payment not completed in time",
              cancelledBy: "system",
              "trackingDates.cancelled": new Date(),
            },
          },
          { session }
        );
      }

      expired = reservation;
    });

    if (expired) {
      logger.info("Reservation expired, stock restored and order cancelled", {
        reservationId: expired._id,
        orderId: expired.orderId,
        user: expired.user,
        items: expired.items,
      });
    }
  } catch (error) {
    logger.error("Failed to expire stock reservation", { reservationId, error });
    throw error;
  } finally {
    await session.endSession();
  }
}


//getorder
static async getOrders(user, page = 1, search = "") {
  try {
    const limit = 10;
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (currentPage - 1) * limit;

    const query = {
      user,
      paymentStatus: { $ne: "pending" },
    };

    // Search by order ID (partial match, e.g. the last 8 chars shown in the UI)
    const term = String(search).trim().replace(/^#/, "");

    if (term) {
      // escape regex special characters so user input can't break the query
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.$expr = {
        $regexMatch: {
          input: { $toString: "$_id" },
          regex: escaped,
          options: "i",
        },
      };
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .populate("items.product")
        .populate("address")
        .populate("coupon")
        .populate('return')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Order.countDocuments(query),
    ]);

    return {
      orders,
      currentPage,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      limit,
    };
  } catch (error) {
    logger.error("Failed to fetch user orders", {
      user,
      error: error.message,
    });
    throw error;
  }
}


//getorderFOr admin
static async getOrdersAdmin({ page, limit, search, status, payment }) {
  try {
    const query = { paymentStatus: { $ne: "pending" } };

    if (payment) query.paymentStatus = payment;
    if (status) query.orderStatus = status;

    if (search) {
      // escape special characters so typing "(" or "+" doesn't break the regex
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const users = await User.find({
        $or: [
          { name: { $regex: safe, $options: "i" } },
          { email: { $regex: safe, $options: "i" } },
        ],
      }).select("_id");

      query.$or = [
        { user: { $in: users.map((u) => u._id) } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: safe,
              options: "i",
            },
          },
        },
      ];
    }

    const orders = await Order.find(query)
      .populate("items.product")
      .populate("address")
      .populate("coupon")
      .populate("user")
      .populate('return')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);

    // stat cards (all orders, ignoring search / filters)
    const base = { paymentStatus: { $ne: "pending" } };
    const total = await Order.countDocuments(base);
    const confirmed = await Order.countDocuments({ ...base, orderStatus: "confirmed" });
    const shipped = await Order.countDocuments({ ...base, orderStatus: "shipped" });
    const delivered = await Order.countDocuments({ ...base, orderStatus: "delivered" });

    return {
      orders,
      currentPage: page,
      totalPages: Math.max(Math.ceil(totalOrders / limit), 1),
      totalOrders,
      stats: { total, confirmed, shipped, delivered },
    };
  } catch (error) {
    logger.error("Failed to fetch admin orders", {
      error: error.message,
    });
    throw error;
  }
}

//update order STatus
static async updateOrderStatus(orderId, status) {
  try {
    const dateKey = {
      confirmed: "confirmed",
      shipped: "shipped",
      out_for_delivery: "outForDelivery",
      delivered: "delivered",
      cancelled: "cancelled",
      return_requested: "returnRequested",
      returned: "returned",
    };

    // Validate status
    if (!dateKey[status]) {
      throw new Error("Invalid order status");
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Prevent updating terminal statuses
    if (
      order.orderStatus === "delivered" ||
      order.orderStatus === "cancelled" ||
      order.orderStatus === "returned"
    ) {
      throw new Error(`Order is already ${order.orderStatus}`);
    }

    // Update order status
    order.orderStatus = status;

    // Update corresponding tracking date
    order.trackingDates[dateKey[status]] = new Date();

    await order.save();

    return null;

  } catch (error) {
    logger.error("Failed to update order status", {
      error: error.message,
    });

    throw error;
  }
}


//cancel order 
static async cancelOrder(user, data) {
  const session = await mongoose.startSession();
  try {
    const { orderId, cancelReason } = data;

    if (!mongoose.isValidObjectId(orderId)) {
      throw new ValidationError("Invalid order");
    }
    if (!cancelReason || !cancelReason.trim()) {
      throw new ValidationError("Cancel reason is required");
    }

    let cancelledOrder;

    await session.withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);
      if (!order) throw new NotFoundError("Order not found");

      const userId = user._id || user;
      if (order.user.toString() !== userId.toString()) {
        throw new AuthenticationError("You are not allowed to cancel this order");
      }

      if (order.orderStatus === "cancelled") {
        throw new ConflictError("Order is already cancelled");
      }
      if (order.orderStatus !== "confirmed") {
        throw new ConflictError(
          `Order cannot be cancelled once it is ${order.orderStatus}`
        );
      }

      // 1. Release stock
      const reservation = await StockReservation.findOneAndUpdate(
        { orderId: order._id, status: { $in: ["reserved", "confirmed"] } },
        { $set: { status: "released" } },
        { session, new: true }
      );

      if (reservation) {
        const stockOps = order.items.map((item) =>
          item.variantId
            ? {
                updateOne: {
                  filter: { _id: item.product },
                  update: { $inc: { "variants.$[v].stock": item.quantity } },
                  arrayFilters: [{ "v._id": item.variantId }],
                },
              }
            : {
                updateOne: {
                  filter: { _id: item.product },
                  update: { $inc: { stock: item.quantity } },
                },
              }
        );
        await Product.bulkWrite(stockOps, { session });
      }

      // 2. Refund to wallet (only if already paid via wallet/razorpay)
      const needsRefund =
        order.paymentStatus === "paid" &&
        ["wallet", "razorpay"].includes(order.paymentMethod);

      if (needsRefund) {
        const credited = await WalletService.creditRefund({
          userId: order.user,
          orderId: order._id,
          amount: order.totalAmount,
          session,
        });

        if (!credited) {
          throw new ConflictError("Refund for this order was already processed");
        }

        order.paymentStatus = "refunded";
        order.cancelRefund = {
          amount: order.totalAmount,
          status: "completed",
          method: "wallet",
          refundedAt: new Date(),
        };
      }

      // 3. Mark order cancelled
      order.orderStatus = "cancelled";
      order.cancelReason = cancelReason.trim();
      order.cancelledBy = "user";
      order.trackingDates.cancelled = new Date();
      await order.save({ session });

      cancelledOrder = order;
    });

    logger.info("Order cancelled", { orderId, userId: user._id || user });
    return cancelledOrder;
  } catch (error) {
    logger.error("failed to cancel order", {
      orderId: data?.orderId,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  } finally {
    await session.endSession();
  }
}

}








module.exports = OrderService