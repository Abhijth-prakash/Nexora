const OrderService = require("../../services/Orderservice");
const BaseController = require("../baseController");
const config = require('../../config/config');
const PaymentService = require("../../services/Paymentservice");


class OrderController extends BaseController{


    //stockvalidation
    static StockValidation = BaseController.asyncHandler(async (req, res) => {
    const { buyNowItem } = req.body || {};
    const result = await OrderService.StockValidation(
        req.userId,
        buyNowItem
    );

    return this.sendSuccessResponse(
        res,
        "Stock validated successfully",
        result,
        200
    );
});


//orderSummary
static orderSummary = BaseController.asyncHandler(async (req, res) => {
  const couponId = req.query.couponId || req.body?.couponId;
  const isBuyNow =
    req.query.isBuyNow === "true" ||
    req.query.isBuyNow === true ||
    req.body?.isBuyNow;

  let buyNowItem = null;
  if (isBuyNow) {
    buyNowItem = req.body?.buyNowItem || {
      productId: req.query.productId,
      variantId: req.query.variantId || null,
      quantity: req.query.quantity || 1,
      size: req.query.size || null,
    };
  }

  const summary = await OrderService.orderSummary(
    req.userId,
    couponId,
    buyNowItem
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
    const user = req.userId
    const result = await PaymentService.razorpayService(orderId, user)

    if (result.isPaid) {
      return this.sendSuccessResponse(
        res,
        "Order is already paid",
        result,
        200
      );
    }

    BaseController.logAction(
      `Razorpay order ready | Razorpay Order ID: ${result.razorpayOrderId} | Time: ${new Date().toISOString()}`
    );

    return this.sendSuccessResponse(
      res,
      `paymentOrder successfully ready ${result.orderId}`,
      { 
        razorpayOrderId:result.razorpayOrderId,
        amount: result.amount,
        currency: result.currency,
        keyId: config.RazorPay.api_key,
        orderId:result.orderId,
        expiresAt: result.expiresAt,
      },
      201
    )
  }
)



//verify payment
static verifyPayment = BaseController.asyncHandler(
  async (req,res)=>{
    const user = req.userId
    const result = await PaymentService.verifyPayment(user,req.body)

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

//record payment failure
static recordPaymentFailure = BaseController.asyncHandler(
  async (req, res) => {
    const user = req.userId;
    const result = await PaymentService.recordPaymentFailure(user, req.body);

    BaseController.logAction(
      `Payment failure recorded for order ${result.orderId || req.body?.orderId} | User: ${user}`
    );

    return this.sendSuccessResponse(
      res,
      "Payment failure status recorded",
      result,
      200
    );
  }
);

//get payment status
static getPaymentStatus = BaseController.asyncHandler(
  async (req, res) => {
    const user = req.userId;
    const { orderId } = req.params;
    const result = await PaymentService.getPaymentStatus(user, orderId);

    return this.sendSuccessResponse(
      res,
      "Payment status fetched successfully",
      result,
      200
    );
  }
);



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


//getorders
static getOrders = BaseController.asyncHandler(
  async (req, res) => {
    const userId = req.userId;
    const { page = 1, search = "" } = req.query;

    const orders = await OrderService.getOrders(
      userId,
      Number(page),
      search
    );

    BaseController.logAction(
      `fetched orders for user ${userId}`
    );
    return this.sendSuccessResponse(
      res,
      `fetched orders for user ${userId}`,
      orders,
      200
    );
  }
);


//getOrders for admin
static getOrdersAdmin = BaseController.asyncHandler(
  async (req, res) => {

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 5, 50);
    const search = (req.query.search || "").trim();
    const status = (req.query.status || "").trim();
    const payment = (req.query.payment || "").trim();

    const orders = await OrderService.getOrdersAdmin({
      page,
      limit,
      search,
      status,
      payment,
    });

    BaseController.logAction(
      `fetched orders for admin `
    );

    return this.sendSuccessResponse(
      res,
      `fetched orders for admin `,
      orders,
      200
    );
  }
);



static updateOrderStatus = BaseController.asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await OrderService.updateOrderStatus(id, status);

    BaseController.logAction(`updated order ${id} to ${status}`);

    return this.sendSuccessResponse(res, "order status updated", null, 200);
  }
);


//cancel order
static cancelOrder = BaseController.asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { cancelReason } = req.body;
    const user = req.userId;

    const order = await OrderService.cancelOrder(user, {
      orderId: id,
      cancelReason,
    });

    BaseController.logAction(`cancelled order ${id}`);

    return this.sendSuccessResponse(res, "order cancelled successfully", null, 200);
  }
);



//cancel order
static payByWallet = BaseController.asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const user = req.userId;

    const order = await PaymentService.PayByWallet(user, {
      orderId: id,
    });

    BaseController.logAction(`paid order ${id} by wallet for user ${user}`);

    return this.sendSuccessResponse(
      res,
      "order paid successfully",
      order,
      200
    );
  }
);


}



module.exports = OrderController