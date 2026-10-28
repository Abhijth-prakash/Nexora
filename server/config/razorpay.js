const Razorpay = require("razorpay");
const config = require('./config')

const razorpay = new Razorpay({
  key_id: config.RazorPay.api_key,
  key_secret: config.RazorPay.api_secret,
});

module.exports = razorpay;