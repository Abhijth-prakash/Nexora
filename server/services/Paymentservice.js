const Order = require("../models/Order");
const { NotFoundError, ValidationError } = require("../utils/errors");
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
static async razorpayService(orderId) {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    
    if (order.razorpayOrderId) {
      return {
        razorpayOrderId: order.razorpayOrderId,
        amount: Math.round(order.totalAmount * 100),
        currency: "INR",
        keyId: config.RazorPay.api_key,
        orderId: order._id,
      };
    }

    
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: `nexora_${order._id}`,
    });

    order.razorpayOrderId = razorpayOrder.id;
    order.paymentMethod = "razorpay"
    await order.save();

    logger.info(`Razorpay order created: ${razorpayOrder.id}`);

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: config.RazorPay.api_key,
      orderId: order._id,
    };
  } catch (error) {
    logger.error("Failed to create Razorpay order", error);
    throw error;
  }
}



//verifyPaymenet


static async verifyPayment(user, data) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
    } = data;

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user,
    });

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

    // Handle repeated verification requests
    if (order.paymentStatus === "paid") {
      await createCouponRedemption();

      return await Order.getCart({
        _id: order._id,
        user,
      });
    }

    // Verify actual payment status with Razorpay
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured"
    ) {
      throw new ValidationError(
        "Payment has not been captured"
      );
    }

    // Update order payment status
    order.paymentStatus = "paid";
    order.orderDate = new Date();
    order.razorpay_payment_id = razorpay_payment_id

    await order.save();

    // Delete stock reservation
    await StockReservation.findOneAndDelete({
      user,
      orderId: order._id,
    });

    // Clear cart
    await CartService.deleteCart(user);

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

      // Clear cart
      await CartService.deleteCart(userId);

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

   
    if (!alreadyPaid) {
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