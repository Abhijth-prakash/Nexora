const Users = require("../models/User");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const Mail = require('../utils/mail')
const {
  ConflictError,
  AuthenticationError,
  NotFoundError,
  AuthorizationError,
  ValidationError,
  OTPError,
} = require("../utils/errors");
const {generateUserToken} = require('../utils/jwt')

class AuthService {
  static async register(userData) {
    try {
      const existingUser = await Users.findOne({
        email: userData.email,
      });

      if (existingUser) {
        throw new ConflictError("email already exists");
      }

      const otp = Mail.generateOTP()
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);


     const user = new Users({
        ...userData,
        otp,
        otpExpiry,
        Verified: false,
      });
      await user.save();

      await Mail.sendOTP(user.email, otp, user.name);

      logger.info(`New user registered: ${userData.email}. OTP sent.`);

      return {
        user: user.getProfile(),
      };
      
    } catch (error) {
      logger.error("Something went wrong while registering user", error);
      throw error;
    }
  }


  static async verifyOTP(email, otp) {
  try {
    const user = await User.findByEmail(email);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.Verified) {
      throw new ConflictError("already verified");
    }

    if (!user.otp || !user.otpExpiry) {
      throw new OTPError(
        "No active OTP found. Please request a new one"
      );
    }

    const now = new Date();

    if (user.otpExpiry < now) {
      user.otp = null;
      user.otpExpiry = null;

      await user.save();

      throw new OTPError(
        "OTP has expired. Please request a new one"
      );
    }

    if (user.otp !== otp) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;

      if (user.otpAttempts >= 5) {
        user.otp = null;
        user.otpExpiry = null;
        user.otpAttempts = 0;

        await user.save();

        throw new OTPError(
          "Too many failed attempts. Please request a new OTP"
        );
      }

      await user.save();

      throw new OTPError("Invalid OTP");
    }

    user.otpAttempts = 0;
    user.Verified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.lastLogin = new Date();

    await user.save();

    const token = generateUserToken({
      id: user._id,
      email: user.email,
      Verified: true,
      banned: user.banned,
    });

    logger.info(`Email verified for user: ${email}`);

    return {
      user: user.getProfile(),
      token,
    };

  } catch (error) {
    logger.error("OTP verification error:", error);
    throw error;
  }
}

}

module.exports = AuthService;