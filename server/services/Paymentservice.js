const Order = require("../models/Order");
const { NotFoundError, ValidationError } = require("../utils/errors");
const logger = require("../utils/logger");
const config = require('../config/config')
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const User = require('../models/User')
const Mail = require('../utils/mail')


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

static async verifyPayment(data) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      throw new ValidationError("Razorpay order ID mismatch");
    }

    
    const expected = crypto
      .createHmac("sha256", config.RazorPay.api_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (
      expected.length !== razorpay_signature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(expected, "hex"),
        Buffer.from(razorpay_signature, "hex")
      )
    ) {
      throw new ValidationError("Payment signature verification failed");
    }

   
    if (order.paymentStatus === "paid") {
      return true
    }

   
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured"
    ) {
      throw new ValidationError("Payment has not been captured");
    }

 
    order.paymentStatus = "paid";
order.orderDate = new Date();
await order.save();

  
    logger.info(`Payment verified successfully: ${razorpay_payment_id}`);

    return order

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

    // 3. Atomic successful verification
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
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (verifiedOrder) {
      logger.info(`COD OTP verified | Order ID: ${orderId}`);
      return verifiedOrder;
    }

    // 4. Atomic incorrect OTP attempt
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

    // 5. Another request may have changed the OTP state
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

}

module.exports = PaymentService 