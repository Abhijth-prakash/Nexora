const Cart = require("../models/Cart")
const logger = require("../utils/logger")
const { NotFoundError, ConflictError,ValidationError } = require("../utils/errors");
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


//orderVerification
static async orderVerification(user, data) {
  const session = await mongoose.startSession();

  try {
    const { addressId, couponId } = data;

    const address = await Address.findOne({
      _id: addressId,
      user,
    });

    if (!address) {
      throw new NotFoundError("Address not found");
    }

    // release any earlier reservation first, so repeated calls don't drain stock
    await this.releaseUserReservations(user);

    const cart = await this.StockValidation(user);

 
    const summary = await this.orderSummary(user, couponId);

    const reservationId = new mongoose.Types.ObjectId();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    
    const reservationItems = [];

    await session.withTransaction(async () => {
      reservationItems.length = 0; 

      for (const item of cart.items) {
        const product = item.product;

        if (!product) {
          throw new NotFoundError("Product not found");
        }

        const quantity = item.quantity;
        let stockUpdate;

        if (item.variantId) {
       
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
            {
              $inc: {
                "variants.$.stock": -quantity,
              },
            },
            { session }
          );
        } else {
        
          stockUpdate = await Product.updateOne(
            {
              _id: product._id,
              stock: { $gte: quantity },
            },
            {
              $inc: { stock: -quantity },
            },
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
      }

      await StockReservation.create(
        [
          {
            _id: reservationId,
            user,
            items: reservationItems,
            totalAmount:summary.finalAmount,
            coupon:summary.coupon?._id,
            status: "reserved",
            expiresAt,
          },
        ],
        { session }
      );
    });

  
    logger.info("Stock reserved", {
      user,
      reservationId,
      expiresAt,
      items: reservationItems,
    });

    return {
      reservationId,
      expiresAt,
      address,
      summary,
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
  let expired = null; // CHANGED: holds the expired reservation for logging

  try {
    await session.withTransaction(async () => {
      expired = null; // reset in case the transaction is retried

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

      // Restore the reserved stock.
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

      expired = reservation; // CHANGED
    });

  
    if (expired) {
      logger.info("Reservation expired and stock restored", {
        reservationId: expired._id,
        user: expired.user,
        items: expired.items,
      });
    }
  } catch (error) {
    logger.error("Failed to expire stock reservation", {
      reservationId,
      error,
    });
    throw error;
  } finally {
    await session.endSession();
  }
}



//paymentorder

static async PaymentOrder(data) {
  try {
    const { reservationId, addressId } = data;

    const reservation = await StockReservation.findById(reservationId);

    if (!reservation) {
      throw new NotFoundError("Reservation not found");
    }

    if (reservation.status !== "reserved") {
      throw new Error("Reservation is no longer active");
    }

    if (reservation.expiresAt <= new Date()) {
      throw new Error("Reservation has expired");
    }

   
    const items = await Promise.all(
      reservation.items.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) {
          throw new NotFoundError("Product not found");
        }

        let price = product.price;

        if (item.variantId) {
          const variant = product.variants.id(item.variantId);

          if (!variant) {
            throw new NotFoundError("Product variant not found");
          }

          price = variant.price;
        }

        return {
          product: item.product,
          variantId: item.variantId,
          quantity: item.quantity,
          price,
        };
      })
    );

    const amount = reservation.totalAmount;

    
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `nexora_${Date.now()}`,
    });

    
    const newOrder = new Order({
      user: reservation.user,
      items,
      address: addressId,
      totalAmount: amount,
      coupon: reservation.coupon,
      paymentStatus: "pending",
      paymentMethod: "razorpay",
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    logger.info(
      `Payment order created successfully: ${razorpayOrder.id}`
    );

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: config.RazorPay.api_key,
      OrderId: newOrder._id,
    };
  } catch (error) {
    logger.error("Failed to create payment order", error);
    throw error;
  }
}


//verifyPaymenet

static async verifyPayment(data){
  try{

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = data

    const expected = crypto
  .createHmac("sha256", config.RazorPay.api_secret)
  .update(razorpay_order_id + "|" + razorpay_payment_id)
  .digest("hex");

if (expected !== razorpay_signature) {
 throw new ValidationError('payment failed')
}

  logger.info('payment success')
const payment = await razorpay.payments.fetch(razorpay_payment_id);

console.log(payment); 
  }catch(error){
    logger.error('failed to verify payment')
  }
}

}





module.exports = OrderService