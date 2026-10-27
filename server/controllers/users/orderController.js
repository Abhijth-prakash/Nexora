const OrderService = require("../../services/Orderservice");
const BaseController = require("../baseController");


class OrderController extends BaseController{

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

}



module.exports = OrderController