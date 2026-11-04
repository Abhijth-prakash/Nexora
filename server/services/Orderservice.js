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

class OrderService{

    //stockvalidation
   static async StockValidation(user) {
    try {
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
  static async orderSummary(user, couponId) {
  try {
    const cart = await Cart.findOne({ user }).populate("items.product");

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((total, item) => {
      const product = item.product;

      if (!product) {
        throw new NotFoundError("Product in cart not found");
      }

      return total + product.price * item.quantity;
    }, 0);

    let discount = 0;
    let finalAmount = subtotal;
    let coupon = null;

    if (couponId) {
      coupon = await Coupon.findById(couponId);

      if (!coupon) {
        throw new NotFoundError("Coupon not found");
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
    const { addressId, couponId } = data;

    if (!mongoose.isValidObjectId(addressId)) {
      throw new BadRequestError("Invalid address");
    }
    if (couponId && !mongoose.isValidObjectId(couponId)) {
      throw new BadRequestError("Invalid coupon");
    }

    // ---- Lookups ----
    const address = await Address.findOne({ _id: addressId, user });
    if (!address) {
      throw new NotFoundError("Address not found");
    }

    await this.releaseUserReservations(user);

    const cart = await this.StockValidation(user);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestError("Your cart is empty");
    }

    const summary = await this.orderSummary(user, couponId);
    if (!summary || !(summary.finalAmount > 0)) {
      throw new BadRequestError("Invalid order amount");
    }

    const reservationId = new mongoose.Types.ObjectId();
    const orderId = new mongoose.Types.ObjectId();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const reservationItems = [];
    const orderItems = [];

    await session.withTransaction(async () => {
      reservationItems.length = 0;
      orderItems.length = 0;

      for (const item of cart.items) {
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
            `Insufficient stock for ${product.name}. Please refresh your cart.`
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
            subtotal:summary.subtotal,
            discountAmount:summary.discount
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
    };

    if (!Object.keys(dateKey).includes(status) && status !== "cancelled") {
      throw new Error("Invalid order status");
    }

    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.orderStatus === "delivered" || order.orderStatus === "cancelled") {
      throw new Error(`Order is already ${order.orderStatus}`);
    }

    order.orderStatus = status;
    if (dateKey[status]) {
      order.trackingDates[dateKey[status]] = new Date(); // stamp today's date
    }

    await order.save();


    return null;
  } catch (error) {
    logger.error("Failed to update order status", { error: error.message });
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

      // Order must belong to the user
      const userId = user._id || user;
      if (order.user.toString() !== userId.toString()) {
        throw new ForbiddenError("You are not allowed to cancel this order");
      }

      if (order.orderStatus === "cancelled") {
        throw new ConflictError("Order is already cancelled");
      }
      if (["out_for_delivery", "delivered"].includes(order.orderStatus)) {
        throw new ConflictError(
          `Order cannot be cancelled once it is ${order.orderStatus}`
        );
      }

      // Atomically claim the reservation. Returns null if the stock was
      // already given back (expired/deleted), so stock is never restored twice.
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

      order.orderStatus = "cancelled";
      order.cancelReason = cancelReason.trim();
      order.cancelledBy = "user";
      order.trackingDates.cancelled = new Date();
      await order.save({ session });

      cancelledOrder = order;
    });

    return cancelledOrder;
  } catch (error) {
    logger.error("failed to cancel order", { error });
    throw error;
  } finally {
    await session.endSession();
  }
}

}








module.exports = OrderService