const BaseController = require("../baseController");
const Authservice = require("../../services/Authservice");

class AuthController extends BaseController {
  static register = BaseController.asyncHandler(async (req, res) => {

    const result = await Authservice.register(req.body);

    return this.sendSuccessResponse(
      res,
      "User created successfully",
      result,
      201
    );
  });
}

module.exports = AuthController;