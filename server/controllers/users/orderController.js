const OrderService = require("../../services/Orderservice");
const BaseController = require("../baseController");
const config = require('../../config/config');
const PaymentService = require("../../services/Paymentservice");


class OrderController extends BaseController{


    //stockvalidation
    static StockValidation = BaseController.asyncHandler(async (req, res) => {
    const cart = await OrderService.StockValidation(
        req.userId,
    );

    return this.sendSuccessResponse(
        res,
        "Cart validated successfully",
        null,
        200
    );
});


//orderSummary
static orderSummary = BaseController.asyncHandler(async (req, res) => {
  const { couponId } = req.query;

  const summary = await OrderService.orderSummary(
    req.userId,
    couponId
  );
  return this.sendSuccessResponse(
    res,
    "Order summary fetched successfully",
    summary,
    200
  );
});

//orderVerification
static GenerateOrder = BaseController.asyncHandler(
  async (req, res) => {

      const user = req.userId

    const result = await OrderService.GenerateOrder(
      user,
      req.body
    );

     BaseController.logAction(
           `Checkout verified: stock reserved and order ${result.orderId} created for user ${user}`
        );
  
    return this.sendSuccessResponse(
      res,
      `checkout verified , stock reserved, order created orderId=${result.orderId} for user ${result.user}  `,
      {
        reservationId: result.reservationId,
        expiresAt: result.expiresAt,
        address: result.address,
        summary: result.summary,
        orderId:result.orderId
      },
      200
    );
  }
);

//razorpay payment handler
static razorPaymentController = BaseController.asyncHandler(
  async (req,res)=>{
    const {orderId} = req.body
    const result = await PaymentService.razorpayService(orderId)

    BaseController.logAction(
  `Razorpay order created successfully | Razorpay Order ID: ${result.razorpayOrderId} | Time: ${new Date().toISOString()}`
);

    return this.sendSuccessResponse(
      res,
      `paymentOrder succesfully created ${result.OrderId}`  ,
      { 
        razorpayOrderId:result.razorpayOrderId,
        amount: result.amount,
        currency: result.currency,
        keyId: config.RazorPay.api_key,
        orderId:result.orderId
      },
      201
    )
  }
)



//verify payment
static verifyPayment = BaseController.asyncHandler(
  async (req,res)=>{
    const result = await PaymentService.verifyPayment(req.body)

BaseController.logAction(
  `Payment verified successfully | Order ID: ${result._id} | Razorpay Order ID: ${req.body.razorpay_order_id} | Payment ID: ${req.body.razorpay_payment_id} | Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
);

     return this.sendSuccessResponse(
      res,
      `payment verified successfully`  ,
      result,
      201
    )
  }
)



//cod verify otp
static SendCodOtp = BaseController.asyncHandler(
  async (req, res) => {

    const userId = req.userId;
    const { orderId } = req.body;


    const email = await PaymentService.SendCodOtp(userId, orderId);

    BaseController.logAction(
      `COD otp has been sent to ${email}`
    );

    return this.sendSuccessResponse(
      res,
      "OTP has been sent successfully",
      null,
      200
    );
  }
);

//verifycodOtp
static verifyCodOtp = BaseController.asyncHandler(
  async (req, res) => {
    const userId = req.userId;
    const { orderId } = req.body;

    const verifiedOrder = await PaymentService.verifyCodOtp(
      userId,
      req.body
    );

    BaseController.logAction(
      `COD OTP verified successfully | Order ID: ${orderId}`
    );

    return this.sendSuccessResponse(
      res,
      "COD OTP verified successfully",
      verifiedOrder,
      200
    );
  }
);

}



module.exports = OrderController