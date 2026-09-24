const BaseController = require("../baseController");
const Authservice = require("../../services/Authservice");
const passport = require('passport')
const {generateUserToken} = require('../../utils/jwt')
const {
  registerValidate,
  OTPValidation,
  loginValidate,
  EmailValidation,
  resetPassValidation,
  changepasswordValidation,
  ProfileValidation
} = require("../../utils/validation");
const config = require('../../config/config')

class AuthController extends BaseController {
  //registering user
  static register = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(
      registerValidate,
      req.body
    );

    const result = await Authservice.register(validatedData);

    BaseController.logAction("UserRegisterd", result.user);

    return this.sendSuccessResponse(
      res,
      "User created successfully",
      result,
      201
    );
  });


  //verifying otp
  static Verify = BaseController.asyncHandler(async (req, res) => {
    const validatedOtp = BaseController.validateRequest(
      OTPValidation,
      req.body
    );

    const result = await Authservice.verifyOTP(
      validatedOtp.email,
      validatedOtp.otp
    );

  
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    BaseController.logAction("EMAIL_VERIFIED", {
      email: validatedOtp.email,
    });

    return this.sendSuccessResponse(
      res,
      "Email verified successfully",
      {
        user: result.user,
        expiresIn: "7d",
        verification: {
          emailVerified: true,
          verifiedAt: new Date().toISOString(),
        },
      },
      200
    );
  });



//login user
static login = BaseController.asyncHandler(
  async (req, res) => {
    const validatedData = BaseController.validateRequest(
      loginValidate,
      req.body
    );

    const result = await Authservice.login(validatedData);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    BaseController.logAction(
      "user logged in successfully",
      result.user
    );

    return this.sendSuccessResponse(
      res,
      "Login successful",
      { user: result.user },
      200
    );
  }
);

//google auth
static googleCallback = BaseController.asyncHandler(
  async (req, res) => {

    const user = req.user;

    const token = generateUserToken({
      id: user._id,
      email: user.email,
      Verified: user.Verified,
      banned: user.banned,
    });

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    BaseController.logAction(
      "User registered/logged in with Google",
      user
    );
      
    return res.redirect(
  `${config.FRONTEND_URL}/`
);

  }
);

//getting userDetails
static userDetails = BaseController.asyncHandler(
  async (req, res) => {
    const id = req.userId

    const result = await Authservice.UserProfile(id)

    BaseController.logAction(
      `user profile fetched ${result.user.email}`
    )

    return this.sendSuccessResponse(
      res,
      "Profile fetched",
      {
        user: result.user,
      },
      200
    )
  }
)

//userlgout

static logout = BaseController.asyncHandler(
  async (req, res) => {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    BaseController.logAction(
      "user logout successfully"
    );

    return this.sendSuccessResponse(
      res,
      "user logout successfully",
      null,
      200
    );
  }
);


//user/forgetpass

static forgetpassword = BaseController.asyncHandler(
  async (req, res) => {
    
    const validatedData = BaseController.validateRequest(
      EmailValidation,
      req.body
    );

    await Authservice.Forgetpassword(
      validatedData.email
    );

    BaseController.logAction(
      `Reset email sent successfully to ${validatedData.email}`
    );

    return this.sendSuccessResponse(
      res,
      "Reset email sent successfully",
      null,
      200
    );
  }
);


//user/reset password

static resetPassword = BaseController.asyncHandler(
  async (req,res)=>{
    const validatedData = BaseController.validateRequest(resetPassValidation,req.body)

    await Authservice.resetPassword(validatedData)

    BaseController.logAction(
      `password reset successfull `
    );

    return this.sendSuccessResponse(
      res,
      "password reset successfull",
      null,
      200
    );
  }
)


//user/resendOtp

static resendOtp = BaseController.asyncHandler(
  async (req,res)=>{
    const validatedData = BaseController.validateRequest(EmailValidation,req.body)

    await Authservice.resendOtp(validatedData.email)

     BaseController.logAction(
      `new otp has been send succesfully `
    );

    return this.sendSuccessResponse(
      res,
      "new otp has been send succesfully",
      null,
      200
    );

  }
)

//user/changepassword
static changepassword = BaseController.asyncHandler(
  async (req,res)=>{

     const id = req.userId
      const validatedData = BaseController.validateRequest(changepasswordValidation,req.body)

    await Authservice.changePassword(validatedData,id)

    return this.sendSuccessResponse(
      res,
      "password changed succesfully",
      null,
      200
    );

  }
)

//user/editProfile

static editProfile = BaseController.asyncHandler(
  async (req,res)=>{

      const id = req.userId

      const validatedData = BaseController.validateRequest(ProfileValidation,req.body)

      await Authservice.updateProfile(validatedData,id)

      BaseController.logAction(
      `profile updated succesfully of ${validatedData.name} `
    );

     return this.sendSuccessResponse(
      res,
      "profile updated succesfully",
      null,
      200
    );
  }
)

}

module.exports = AuthController;