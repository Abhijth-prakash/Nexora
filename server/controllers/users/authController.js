const BaseController = require("../baseController");
const Authservice = require("../../services/Authservice");
const passport = require('passport')
const {generateUserToken} = require('../../utils/jwt')
const {
  registerValidate,
  OTPValidation,
  loginValidate
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
      
    return res.redirect(
  `${config.FRONTEND_URL}/`
);

  }
);


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
      { user: result.user },
      200
    )
  }
)
}

module.exports = AuthController;