const OrderService = require("../../services/Orderservice");
const BaseController = require("../baseController");


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

}



module.exports = OrderController