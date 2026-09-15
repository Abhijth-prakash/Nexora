const Admin = require('../../models/Admin')
const Adminservice = require("../../services/Adminservice");
const { loginValidate, EmailValidation } = require('../../utils/validation');
const BaseController = require('../baseController');



class AdminController extends BaseController{

  //login
    static login = BaseController.asyncHandler(
        
        async(req,res)=>{
           const validatedData = BaseController.validateRequest(loginValidate,req.body)
           const result = await Adminservice.login(validatedData)

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    BaseController.logAction("ADMIN_LOGIN", result.admin);

    BaseController.sendSuccessResponse(
      res,
      "Login successful",
      {
        admin: result.admin,
        expiresIn: result.expiresIn,
      },
      200,
    );

        }
    )

static Forgetpassword = BaseController.asyncHandler(
  async (req, res) => {
    const Email = BaseController.validateRequest(
      EmailValidation,
      req.body
    );

    await Adminservice.Forgetpass(Email.email);

    BaseController.logAction(
      `Password reset email sent for ${Email.email}`
    );

    return BaseController.sendSuccessResponse(
      res,
      "Reset password email sent",
      null,
      200
    );
  }
);

}


module.exports = AdminController