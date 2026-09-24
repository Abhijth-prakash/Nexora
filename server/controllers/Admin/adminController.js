const Admin = require('../../models/Admin')
const Adminservice = require("../../services/Adminservice");
const { loginValidate, EmailValidation, resetPassValidation } = require('../../utils/validation');
const BaseController = require('../baseController');



class AdminController extends BaseController{

  //login
    static Login = BaseController.asyncHandler(
        
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


    //forget password
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

static Resetpassword = BaseController.asyncHandler(
  async(req,res)=>{
    const data =  BaseController.validateRequest(resetPassValidation,req.body)
    await Adminservice.passwordReset(data)

     BaseController.logAction(
      `Password succesfully reset`
    );

    return BaseController.sendSuccessResponse(
      res,
      "Password succesfully reset",
      null,
      200
    );

  }
)

//logout


static Logout = BaseController.asyncHandler(
  async(req,res)=>{
     res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    BaseController.logAction(
      "admin logout successfully"
    );

    return this.sendSuccessResponse(
      res,
      "admin logout successfully",
      null,
      200
    );
  }
)

}


module.exports = AdminController