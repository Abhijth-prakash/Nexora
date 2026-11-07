const Order = require("../models/Order");
const { NotFoundError, ValidationError, ConflictError } = require("../utils/errors");
const logger = require("../utils/logger");
const config = require('../config/config')
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const User = require('../models/User')
const Mail = require('../utils/mail');
const StockReservation = require("../models/StockReservation");
const CartService = require("./cartService");
const {CouponRedemption}= require('../models/Coupon')
const Refund = require('../models/Return') 
const mongoose = require('mongoose')
const Wallet = require('../models/Wallet')

class PaymentService{


//razorpayservice
static async razorpayService(orderId, userId = null) {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (userId && order.user.toString() !== userId.toString()) {
      throw new NotFoundError("Order not found");
    }

    // Check if order is already paid
    if (order.paymentStatus === "paid") {
      return {
        isPaid: true,
        orderId: order._id,
        message: "Order is already paid",
      };
    }

    // Check if order is cancelled
    if (order.orderStatus === "cancelled") {
      throw new ValidationError(
        order.cancelReason || "This order has been cancelled"
      );
    }

    // Reconcile with Razorpay in case payment was already captured (Scenario 8)
    if (order.razorpayOrderId) {
      try {
        const payments = await razorpay.orders.fetchPayments(order.razorpayOrderId);
        const capturedPayment = payments.items?.find((p) => p.status === "captured");
        if (capturedPayment) {
          order.paymentStatus = "paid";
          order.orderDate = new Date();
          order.razorpay_payment_id = capturedPayment.id;
          order.paymentMethod = "razorpay";
          await order.save();

          await StockReservation.findOneAndDelete({
            orderId: order._id,
          });

          if (!order.isBuyNow) {
            await CartService.deleteCart(order.user);
          }

          if (order.coupon) {
            await CouponRedemption.updateOne(
              { coupon: order.coupon, user: order.user, order: order._id },
              { $setOnInsert: { coupon: order.coupon, user: order.user, order: order._id } },
              { upsert: true }
            );
          }

          logger.info(`Auto-reconciled captured payment for order ${order._id}`);
          return {
            isPaid: true,
            orderId: order._id,
            message: "Payment already completed successfully",
          };
        }
      } catch (checkErr) {
        logger.warn("Could not check Razorpay payments in razorpayService", checkErr);
      }
    }

    // Validate stock reservation
    const reservation = await StockReservation.findOne({
      orderId: order._id,
      status: "reserved",
      expiresAt: { $gt: new Date() },
    });

    if (!reservation) {
      if (order.paymentStatus !== "paid") {
        order.orderStatus = "cancelled";
        order.cancelReason = "Stock reservation expired";
        order.cancelledBy = "system";
        await order.save();
      }
      throw new ConflictError(
        "Stock reservation has expired. Please return to checkout to initiate a fresh reservation."
      );
    }

    // Reuse existing razorpayOrderId if present
    if (order.razorpayOrderId) {
      return {
        razorpayOrderId: order.razorpayOrderId,
        amount: Math.round(order.totalAmount * 100),
        currency: "INR",
        keyId: config.RazorPay.api_key,
        orderId: order._id,
        expiresAt: reservation.expiresAt,
      };
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: `nexora_${order._id}`,
    });

    order.razorpayOrderId = razorpayOrder.id;
    order.paymentMethod = "razorpay";
    await order.save();

    logger.info(`Razorpay order created: ${razorpayOrder.id}`);

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: config.RazorPay.api_key,
      orderId: order._id,
      expiresAt: reservation.expiresAt,
    };
  } catch (error) {
    logger.error("Failed to create Razorpay order", error);
    throw error;
  }
}



//verifyPayment
static async verifyPayment(user, data) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = data;

    if (!razorpay_order_id || !razorpay_payment_id) {
      throw new ValidationError("Missing payment verification parameters");
    }

    let order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user,
    });

    if (!order && orderId && mongoose.isValidObjectId(orderId)) {
      order = await Order.findOne({ _id: orderId, user });
    }

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Create coupon redemption
    const createCouponRedemption = async () => {
      if (!order.coupon) return;

      await CouponRedemption.updateOne(
        {
          coupon: order.coupon,
          user,
          order: order._id,
        },
        {
          $setOnInsert: {
            coupon: order.coupon,
            user,
            order: order._id,
          },
        },
        { upsert: true }
      );
    };

    // Handle repeated verification requests (idempotent)
    if (order.paymentStatus === "paid") {
      await createCouponRedemption();

      return await Order.getCart({
        _id: order._id,
        user,
      });
    }

    // 1. Verify Razorpay cryptographic HMAC signature
    if (razorpay_signature) {
      const generated_signature = crypto
        .createHmac("sha256", config.RazorPay.api_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        order.paymentStatus = "failed";
        await order.save();
        throw new ValidationError("Payment signature verification failed");
      }
    }

    // 2. Verify actual payment status with Razorpay (source of truth)
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured"
    ) {
      order.paymentStatus = "failed";
      await order.save();
      throw new ValidationError(
        "Payment has not been captured"
      );
    }

    // 3. Amount verification
    const expectedAmount = Math.round(order.totalAmount * 100);
    if (payment.amount !== expectedAmount) {
      order.paymentStatus = "failed";
      await order.save();
      throw new ValidationError("Payment amount mismatch");
    }

    // Update order payment status
    order.paymentStatus = "paid";
    order.orderDate = new Date();
    order.razorpay_payment_id = razorpay_payment_id;
    order.paymentMethod = "razorpay";

    await order.save();

    // Delete stock reservation
    await StockReservation.findOneAndDelete({
      user,
      orderId: order._id,
    });

    // Clear cart (preserve for Buy Now)
    if (!order.isBuyNow) {
      await CartService.deleteCart(user);
    }

    // Create coupon redemption
    await createCouponRedemption();

    logger.info(
      `Payment verified successfully: ${razorpay_payment_id}`
    );

    // Return populated order
    return await Order.getCart({
      _id: order._id,
      user,
    });

  } catch (error) {
    logger.error("Failed to verify payment", error);
    throw error;
  }
}



// recordPaymentFailure
static async recordPaymentFailure(userId, data) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, error } = data || {};

    const query = { user: userId };
    if (orderId && mongoose.isValidObjectId(orderId)) {
      query._id = orderId;
    } else if (razorpayOrderId) {
      query.razorpayOrderId = razorpayOrderId;
    } else {
      throw new ValidationError("Order identifier required");
    }

    const order = await Order.findOne(query);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Never downgrade an already paid order
    if (order.paymentStatus === "paid") {
      return { isPaid: true, orderId: order._id };
    }

    // Safety reconciliation check (Scenario 8)
    const effectiveRazorpayOrderId = order.razorpayOrderId || razorpayOrderId;
    if (effectiveRazorpayOrderId) {
      try {
        const payments = await razorpay.orders.fetchPayments(effectiveRazorpayOrderId);
        const captured = payments.items?.find((p) => p.status === "captured");
        if (captured) {
          order.paymentStatus = "paid";
          order.orderDate = new Date();
          order.razorpay_payment_id = captured.id;
          order.paymentMethod = "razorpay";
          await order.save();

          await StockReservation.findOneAndDelete({
            user: userId,
            orderId: order._id,
          });

          if (!order.isBuyNow) {
            await CartService.deleteCart(userId);
          }

          if (order.coupon) {
            await CouponRedemption.updateOne(
              { coupon: order.coupon, user: userId, order: order._id },
              { $setOnInsert: { coupon: order.coupon, user: userId, order: order._id } },
              { upsert: true }
            );
          }

          logger.info(`Auto-reconciled captured payment during failure recording: ${order._id}`);
          return { isPaid: true, orderId: order._id };
        }
      } catch (checkErr) {
        logger.warn("Could not check Razorpay payments during failure recording", checkErr);
      }
    }

    // Mark paymentStatus as failed (keeping StockReservation intact for retry)
    order.paymentStatus = "failed";
    if (razorpayPaymentId) {
      order.razorpay_payment_id = razorpayPaymentId;
    }
    await order.save();

    logger.info(`Payment recorded as failed for order ${order._id}`, {
      reason: error?.description || error?.reason || "Payment failed",
    });

    return {
      isPaid: false,
      paymentStatus: "failed",
      orderId: order._id,
    };
  } catch (error) {
    logger.error("Failed to record payment failure", error);
    throw error;
  }
}



// getPaymentStatus
static async getPaymentStatus(userId, orderId) {
  try {
    if (!mongoose.isValidObjectId(orderId)) {
      throw new ValidationError("Invalid order ID");
    }

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate("items.product")
      .populate("address")
      .populate("coupon");

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // 1. If already marked paid
    if (order.paymentStatus === "paid") {
      return {
        status: "paid",
        isPaid: true,
        orderStatus: order.orderStatus,
        reservationValid: false,
        expiresAt: null,
        order,
      };
    }

    // 2. Auto-reconcile with Razorpay (Scenario 8)
    if (order.razorpayOrderId) {
      try {
        const payments = await razorpay.orders.fetchPayments(order.razorpayOrderId);
        const captured = payments.items?.find((p) => p.status === "captured");
        if (captured) {
          order.paymentStatus = "paid";
          order.orderDate = new Date();
          order.razorpay_payment_id = captured.id;
          order.paymentMethod = "razorpay";
          await order.save();

          await StockReservation.findOneAndDelete({
            user: userId,
            orderId: order._id,
          });

          if (!order.isBuyNow) {
            await CartService.deleteCart(userId);
          }

          if (order.coupon) {
            await CouponRedemption.updateOne(
              { coupon: order.coupon, user: userId, order: order._id },
              { $setOnInsert: { coupon: order.coupon, user: userId, order: order._id } },
              { upsert: true }
            );
          }

          logger.info(`Auto-reconciled captured payment during getPaymentStatus: ${order._id}`);
          return {
            status: "paid",
            isPaid: true,
            orderStatus: order.orderStatus,
            reservationValid: false,
            expiresAt: null,
            order,
          };
        }
      } catch (err) {
        logger.warn("Could not check Razorpay payments during getPaymentStatus", err);
      }
    }

    // 3. Check stock reservation
    const reservation = await StockReservation.findOne({
      orderId: order._id,
      user: userId,
      status: "reserved",
    });

    const isReservationValid = Boolean(
      reservation && new Date(reservation.expiresAt) > new Date()
    );

    if (!isReservationValid && order.paymentStatus !== "paid") {
      if (order.orderStatus !== "cancelled") {
        order.orderStatus = "cancelled";
        order.cancelReason = "Stock reservation expired";
        order.cancelledBy = "system";
        await order.save();
      }
    }

    return {
      status: order.paymentStatus,
      isPaid: false,
      orderStatus: order.orderStatus,
      reservationValid: isReservationValid,
      expiresAt: isReservationValid ? reservation.expiresAt : null,
      order,
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      keyId: config.RazorPay.api_key,
      razorpayOrderId: order.razorpayOrderId,
      cancelReason: order.cancelReason,
    };
  } catch (error) {
    logger.error("Failed to get payment status", error);
    throw error;
  }
}




//cod verify
static async SendCodOtp(userId, orderId) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new AuthenticationError("user not found");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("order not found");
    }

   
    if (order.user.toString() !== userId.toString()) {
      throw new NotFoundError("order not found");
    }

    

    const otp = Mail.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  order.otp = otp;
order.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
order.otpAttempts = 0;
order.otpVerified = false;
    await order.save();

    await Mail.sendCodConfirmationOtpEmail(
      user.email,
      otp,
      user.name,
      orderId
    );

    logger.info(`COD confirmation OTP sent to ${user.email}`);

    return user.email;
  } catch (error) {
    logger.error("failed to send COD otp", error);
    throw error;
  }
}


static async verifyCodOtp(userId, data) {
  try {
    const { orderId, otp } = data;
    const MAX_ATTEMPTS = 5;
    const submittedOtp = String(otp);

    // 1. Find order and validate ownership
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // 2. Validate OTP state
    if (order.otpVerified) {
      throw new ValidationError("OTP already verified");
    }

    if (!order.otp || !order.otpExpiry) {
      throw new ValidationError("OTP is invalid or unavailable");
    }

    if (order.otpExpiry <= new Date()) {
      throw new ValidationError("OTP expired");
    }

    if (order.otpAttempts >= MAX_ATTEMPTS) {
      throw new ValidationError("Maximum OTP attempts exceeded");
    }

    const verifiedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        user: userId,
        otp: submittedOtp,
        otpExpiry: { $gt: new Date() },
        otpAttempts: { $lt: MAX_ATTEMPTS },
        otpVerified: false,
      },
      {
        $set: {
          otp: null,
          otpExpiry: null,
          otpVerified: true,
          paymentMethod: "cod",
          paymentStatus:"cod"
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (verifiedOrder) {
      logger.info(`COD OTP verified | Order ID: ${orderId}`);

      // Delete stock reservation
      await StockReservation.findOneAndDelete({
        user: userId,
        orderId: verifiedOrder._id,
      });

      // Clear cart (preserve for Buy Now)
      if (!verifiedOrder.isBuyNow) {
        await CartService.deleteCart(userId);
      }

      // Coupon redemption
      if (verifiedOrder.coupon) {
        await CouponRedemption.updateOne(
          {
            order: verifiedOrder._id,
          },
          {
            $setOnInsert: {
              coupon: verifiedOrder.coupon,
              user: verifiedOrder.user,
              order: verifiedOrder._id,
              discountAmount: verifiedOrder.discountAmount || 0,
              redeemedAt: new Date(),
            },
          },
          {
            upsert: true,
          }
        );
      }

      // Return populated order
      return await Order.getCart({
        _id: verifiedOrder._id,
        user: userId,
      });
    }

    // 3. Increment attempts for incorrect OTP
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        user: userId,
        otp: { $ne: submittedOtp },
        otpExpiry: { $gt: new Date() },
        otpAttempts: { $lt: MAX_ATTEMPTS },
        otpVerified: false,
      },
      {
        $inc: {
          otpAttempts: 1,
        },
      },
      {
        new: true,
      }
    );

    if (updatedOrder) {
      const remainingAttempts =
        MAX_ATTEMPTS - updatedOrder.otpAttempts;

      throw new ValidationError(
        `Incorrect OTP. ${remainingAttempts} attempts remaining`
      );
    }

    // 4. Recheck OTP state
    const latestOrder = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!latestOrder) {
      throw new NotFoundError("Order not found");
    }

    if (latestOrder.otpVerified) {
      throw new ValidationError("OTP already verified");
    }

    if (!latestOrder.otp || !latestOrder.otpExpiry) {
      throw new ValidationError("OTP is invalid or unavailable");
    }

    if (latestOrder.otpExpiry <= new Date()) {
      throw new ValidationError("OTP expired");
    }

    if (latestOrder.otpAttempts >= MAX_ATTEMPTS) {
      throw new ValidationError("Maximum OTP attempts exceeded");
    }

    throw new ValidationError(
      "OTP verification failed. Please try again."
    );

  } catch (error) {
    logger.error(`COD OTP verification failed: ${error.message}`);
    throw error;
  }
}



//paybywallet
static async PayByWallet(user, data) {
  const session = await mongoose.startSession();
  try {
    const { orderId } = data;

    if (!mongoose.isValidObjectId(orderId)) {
      throw new ValidationError("Invalid order");
    }

    let paidOrder;
    let alreadyPaid = false;

    await session.withTransaction(async () => {
    
      const order = await Order.findOneAndUpdate(
        { _id: orderId, user, paymentStatus: "pending" },
        {
          paymentStatus: "paid",
          paymentMethod: "wallet",
          orderDate: new Date(),
        },
        { new: true, session }
      );

      if (!order) {
        const existing = await Order.findOne({ _id: orderId, user }).session(session);
        if (!existing) throw new NotFoundError("Order not found");

        if (existing.paymentStatus === "paid") {
          alreadyPaid = true; 
          paidOrder = existing;
          return;
        }
        throw new ValidationError("Order is not payable");
      }

    
      const wallet = await Wallet.findOne({ user }).session(session);
      if (!wallet) {
        throw new ValidationError("Wallet not found. Add money to your wallet first");
      }

      
      if (wallet.balance < order.totalAmount) {
        throw new ValidationError("Insufficient wallet balance");
      }

     
      const debited = await Wallet.findOneAndUpdate(
        { user, balance: { $gte: order.totalAmount } },
        {
          $inc: { balance: -order.totalAmount },
          $push: {
            transactions: {
              type: "debit",
              reason: "order_payment",
              amount: order.totalAmount,
              order: order._id,
            },
          },
        },
        { new: true, session }
      );

      if (!debited) throw new ValidationError("Insufficient wallet balance");

     
      await StockReservation.findOneAndDelete(
        { user, orderId: order._id },
        { session }
      );

     
      if (order.coupon) {
        await CouponRedemption.updateOne(
          { coupon: order.coupon, user, order: order._id },
          { $setOnInsert: { coupon: order.coupon, user, order: order._id } },
          { upsert: true, session }
        );
      }

      paidOrder = order;
    });

   
    if (!alreadyPaid && !paidOrder.isBuyNow) {
      await CartService.deleteCart(user);
    }

    logger.info(`Order ${paidOrder._id} paid by wallet for user ${user}`);

    // 8. Return populated order
    return await Order.getCart({ _id: paidOrder._id, user });
  } catch (error) {
    logger.error("failed to pay the amount by wallet", error);
    throw error;
  } finally {
    await session.endSession();
  }
}






}

module.exports = PaymentService 