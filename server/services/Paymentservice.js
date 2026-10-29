


class PaymentService{


// //paymentorder

// static async PaymentOrder(data) {
//   try {
//     const { reservationId, addressId } = data;

//     const reservation = await StockReservation.findById(reservationId);

//     if (!reservation) {
//       throw new NotFoundError("Reservation not found");
//     }

//     if (reservation.status !== "reserved") {
//       throw new Error("Reservation is no longer active");
//     }

//     if (reservation.expiresAt <= new Date()) {
//       throw new Error("Reservation has expired");
//     }

   
//     const items = await Promise.all(
//       reservation.items.map(async (item) => {
//         const product = await Product.findById(item.product);

//         if (!product) {
//           throw new NotFoundError("Product not found");
//         }

//         let price = product.price;

//         if (item.variantId) {
//           const variant = product.variants.id(item.variantId);

//           if (!variant) {
//             throw new NotFoundError("Product variant not found");
//           }

//           price = variant.price;
//         }

//         return {
//           product: item.product,
//           variantId: item.variantId,
//           quantity: item.quantity,
//           price,
//         };
//       })
//     );

//     const amount = reservation.totalAmount;

    
//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(amount * 100),
//       currency: "INR",
//       receipt: `nexora_${Date.now()}`,
//     });

    
//     const newOrder = new Order({
//       user: reservation.user,
//       items,
//       address: addressId,
//       totalAmount: amount,
//       coupon: reservation.coupon,
//       paymentStatus: "pending",
//       paymentMethod: "razorpay",
//       razorpayOrderId: razorpayOrder.id,
//     });

//     await newOrder.save();

//     logger.info(
//       `Payment order created successfully: ${razorpayOrder.id}`
//     );

//     return {
//       razorpayOrderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//       keyId: config.RazorPay.api_key,
//       OrderId: newOrder._id,
//     };
//   } catch (error) {
//     logger.error("Failed to create payment order", error);
//     throw error;
//   }
// }


// //verifyPaymenet

// static async verifyPayment(data){
//   try{

//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature,paymentMethod,otp,orderId } = data

//    if (paymentMethod === "cod") {
//     console.log(otp)
//     console.log(orderId)
//   if (!orderId || !otp) {
//     throw new ValidationError("orderId and otp are required");
//   }

//   const order = await Order.findById(orderId);

//   if (!order) {
//     throw new NotFoundError("order not found");
//   }



//   if (!order.otp || !order.otpExpiry) {
//     throw new ValidationError("No OTP was requested for this order");
//   }

//   if (order.otpExpiry < new Date()) {
//     throw new ValidationError("OTP has expired. Please request a new one");
//   }

//   if (order.otp !== String(otp)) {
//     throw new ValidationError("Invalid OTP");
//   }

  
//   order.otp = undefined;
//   order.otpExpiry = undefined;
//   order.paymentMethod = "cod";       
//   await order.save();

//   return true;
// }

//     const expected = crypto
//   .createHmac("sha256", config.RazorPay.api_secret)
//   .update(razorpay_order_id + "|" + razorpay_payment_id)
//   .digest("hex");

// if (expected !== razorpay_signature) {
//  throw new ValidationError('payment failed')
// }

//   logger.info('payment success')
// const payment = await razorpay.payments.fetch(razorpay_payment_id);

// console.log(payment); 
//   }catch(error){
//     logger.error('failed to verify payment')
//   }
// }



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