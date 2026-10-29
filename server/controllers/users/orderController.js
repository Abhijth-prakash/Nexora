const OrderService = require("../../services/Orderservice");
const BaseController = require("../baseController");
const config = require('../../config/config')


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
static orderVerification = BaseController.asyncHandler(
  async (req, res) => {
    const result = await OrderService.orderVerification(
      req.userId,
      req.body
    );

    return this.sendSuccessResponse(
      res,
      "Checkout verified and stock reserved successfully",
      {
        reservationId: result.reservationId,
        expiresAt: result.expiresAt,
        address: result.address,
        summary: result.summary,
      },
      200
    );
  }
);

//payment
static PaymentController = BaseController.asyncHandler(
  async (req,res)=>{
    
    const result = await OrderService.PaymentOrder(req.body)

    return this.sendSuccessResponse(
      res,
      `paymentOrder succesfully created ${result.OrderId}`  ,
      { 
        razorpayOrderId:result.razorpayOrderId,
        orderId: result.OrderId,
        amount: result.amount,
        currency: result.currency,
        keyId: config.RazorPay.api_key,
      },
      201
    )
  }
)

//verify payment
static verifyPayment = BaseController.asyncHandler(
  async (req,res)=>{
    const result = await OrderService.verifyPayment(req.body)

     return this.sendSuccessResponse(
      res,
      `payment verified successfully`  ,
      null,
      201
    )



  }
)

}



module.exports = OrderController