const Admin = require('../../models/Admin')
const Adminservice = require("../../services/Adminservice");
const { loginValidate } = require('../../utils/validation');
const BaseController = require('../baseController');



class AdminController extends BaseController{

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

}


module.exports = AdminController