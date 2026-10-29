const Order = require("../models/Order");
const { NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");
const config = require('../config/config')
const razorpay = require("../config/razorpay");
const crypto = require("crypto");


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

    // Verify Razorpay signature
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



// //cod verify

// static async codVerify(userId, orderId) {
//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       throw new AuthenticationError("user not found");
//     }

//     const order = await Order.findById(orderId);

//     if (!order) {
//       throw new NotFoundError("order not found");
//     }

   
//     if (order.user.toString() !== userId.toString()) {
//       throw new NotFoundError("order not found");
//     }

    

//     const otp = Mail.generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//     order.otp = otp;
//     order.otpExpiry = otpExpiry;

//     await order.save();

//     await Mail.sendCodConfirmationOtpEmail(
//       user.email,
//       otp,
//       user.name,
//       orderId
//     );

//     logger.info(`COD confirmation OTP sent to ${user.email}`);

//     return user.email;
//   } catch (error) {
//     logger.error("failed to send COD otp", error);
//     throw error;
//   }
// }


}

module.exports = PaymentService 