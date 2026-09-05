const BaseController = require("../baseController");
const Authservice = require("../../services/Authservice");
const {registerValidate,OTPValidation} = require('../../utils/validation')

class AuthController extends BaseController {
  static register = BaseController.asyncHandler(async (req, res) => {
    
    const validatedData = BaseController.validateRequest(registerValidate,req.body)

    const result = await Authservice.register(validatedData);
    BaseController.logAction("UserRegisterd",result.user)

    return this.sendSuccessResponse(
      res,
      "User created successfully",
      result,
      201
    );
  });

  static Verify = BaseController.asyncHandler(async (req,res)=>{

    const validatedOtp = BaseController.validateRequest(OTPValidation,req.body)

  }) 

  
}

module.exports = AuthController;