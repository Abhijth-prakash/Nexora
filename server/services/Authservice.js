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
        verified: false,
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
    const user = await Users.findByEmail(email);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.verified) {
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
    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.lastLogin = new Date();

    await user.save();

    const token = generateUserToken({
      id: user._id,
      email: user.email,
      verified: true,
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

static async login(userData) {
  try {
    const user = await Users.findOne({ email: userData.email });

    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    const checkpass = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!checkpass) {
      throw new AuthenticationError("Invalid email or password");
    }

    logger.info(`${user.name} logged in successfully, ${user.email}`);

    const token = generateUserToken({
      id: user._id,
      email: user.email,
      verified: user.verified,
      banned: user.banned,
    });

    return {
      user: user.getProfile(),
      token,
    };
  } catch (error) {
    logger.error("Something went wrong while logging in user", error);
    throw error;
  }
}

static async UserProfile(id) {
  try {
    const user = await Users.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }


    return {
      user: user.getProfile(),
    };

  } catch (error) {
    logger.error("Something went wrong while getting user profile", error);
    throw error;
  }
}

static async Forgetpassword(email) {
  try {
    const user = await Users.findOne({ email });

    if (!user) {
      throw new NotFoundError("Email not registered");
    }

    const token = Mail.generateResetToken();

    const resetTokenExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.resetToken = token;
    user.resetTokenExpiry = resetTokenExpiry;

    await user.save();

    await Mail.sendResetPasswordEmail(
      user.email,
      token,
      user.name
    );

    return true;

  } catch (error) {
    logger.error(
      "Failed to send reset password email",
      error
    );

    throw error;
  }
}


//reset password

static async resetPassword(data){
  try{

     const user = await Users.findOne({
        resetToken: data.token,
        resetTokenExpiry: { $gt: new Date() },
      });

        if (!user) {
        throw new NotFoundError("Invalid or expired token");
      }

        if (user.password) {
        const prevPassword = await  bcrypt.compare(data.password,user.password)
        if (prevPassword) {
          throw new ConflictError(
            "Please choose a different password. You cannot reuse your current password.",
          );
        }
      }

      user.password = data.password;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();

      logger.info(`Password reset successful for user: ${user.email}`);
      return true;


  }catch(error){
    logger.error('failed to reset password',error)
    throw error
  }
}

static async resendOtp(email) {
  try {
    const User = await Users.findOne({
      email: email,
    });

    if (!User) {
      throw new AuthenticationError("User not found");
    }

    if (User.verified) {
      throw new AuthenticationError("User already verified");
    }

    const otp = Mail.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    User.otp = otp;
    User.otpExpiry = otpExpiry;

    await User.save();

    await Mail.sendOTP(User.email, otp, User.name);

    logger.info(`New OTP has been sent to ${User.email}`);

    return true;
  } catch (error) {
    logger.error("Unable to send new OTP", error);
    throw error;
  }
}


//change password

static async changePassword(data, id) {
  try {
    console.log(id)
    const user = await Users.findById(id)

    if (!user) {
      throw new AuthenticationError("no user found")
    }

    const checkpass = await bcrypt.compare(
      data.currentpassword,
      user.password
    )

    if (!checkpass) {
      throw new AuthenticationError("Invalid email or password")
    }

    const prevPassword = await bcrypt.compare(
      data.newpassword,
      user.password
    )

    if (prevPassword) {
      throw new ConflictError(
        "Please choose a different password. You cannot reuse your current password."
      )
    }

    user.password = data.newpassword

    await user.save()

    logger.info(`successfully changed password for ${user.name}`)

    return true

  } catch (error) {
    logger.error("Unable to change password", error)
    throw error
  }
}

static async updateProfile(data, id) {
  try {
    const user = await Users.findById(id)

    if (!user) {
      throw new NotFoundError("user not found")
    }

    if (user.email !== data.email) {
      user.email = data.email
      user.verified = false
    }

    user.name = data.name

    await user.save()

    logger.info(`successfully updated profile for ${user.name}`)

    return true

  } catch (error) {
    logger.error("Unable to update profile", error)
    throw error
  }
}

}

module.exports = AuthService;