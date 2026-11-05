const ReturnService = require("../../services/Returnservice");
const { ReturnValidation } = require("../../utils/validation");
const BaseController = require("../baseController");

class ReturnController extends BaseController{

   static generateReturn = BaseController.asyncHandler(
  async (req, res) => {
    const user = req.userId;
    const data = BaseController.validateRequest(ReturnValidation, req.body);

    const result = await ReturnService.generateReturn(user, data);

    BaseController.logAction(
      `return ${result._id} requested for order ${data.orderId} by user ${user}`
    );

    return this.sendSuccessResponse(
      res,
      "return request submitted successfully",
      result,
      201
    );
  }
);


//updateReturnStatus
static updateReturnStatus = BaseController.asyncHandler(
  async (req, res) => {
    const { returnId } = req.params;
    const { status, adminNote, rejectionReason } = req.body;

    const result = await ReturnService.updateReturnStatus(
      returnId,
      status,
      {
        adminNote,
        rejectionReason,
      }
    );

    BaseController.logAction(
      `return ${returnId} status updated to ${status} by admin ${req.userId}`
    );

    return this.sendSuccessResponse(
      res,
      "return status updated successfully",
      result,
      200
    );
  }
);


//get all returns
static getAllReturns = BaseController.asyncHandler(
  async (req, res) => {
    const returns = await ReturnService.getAllReturns();

    return this.sendSuccessResponse(
      res,
      "Returns fetched successfully",
      returns,
      200
    );
  }
);

}
module.exports = ReturnController