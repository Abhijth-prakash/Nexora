const Order = require("../models/Order");
const { NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");
const config = require('../config/config')
const razorpay = require("../config/razorpay");


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

static async verifyPayment(data){
  try{

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature,orderId } = data

   if (paymentMethod === "cod") {
    console.log(otp)
    console.log(orderId)
  if (!orderId || !otp) {
    throw new ValidationError("orderId and otp are required");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError("order not found");
  }



  if (!order.otp || !order.otpExpiry) {
    throw new ValidationError("No OTP was requested for this order");
  }

  if (order.otpExpiry < new Date()) {
    throw new ValidationError("OTP has expired. Please request a new one");
  }

  if (order.otp !== String(otp)) {
    throw new ValidationError("Invalid OTP");
  }

  
  order.otp = undefined;
  order.otpExpiry = undefined;
  order.paymentMethod = "cod";       
  await order.save();

  return true;
}

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