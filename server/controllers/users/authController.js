const BaseController = require("../baseController");
const Authservice = require("../../services/Authservice");
const passport = require('passport')
const {generateUserToken} = require('../../utils/jwt')
const {
  registerValidate,
  OTPValidation,
} = require("../../utils/validation");

class AuthController extends BaseController {
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


static googleCallback = BaseController.asyncHandler(
  async (req, res) => {

    const user = req.user;

    const token = generateUserToken({
      id: user._id,
      email: user.email,
      Verified: user.Verified,
      banned: user.banned,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    BaseController.logAction(
      "User registered/logged in with Google",
      user
    );

    return this.sendSuccessResponse(
      res,
      "Google authentication successful",
      {
        user: user.getProfile ? user.getProfile() : user,
      },
      200
    );
  }
);
}

module.exports = AuthController;