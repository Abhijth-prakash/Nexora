const Admin = require("../models/Admin");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const Mail = require('../utils/mail')
const {generateAdminToken} = require('../utils/jwt')
const {
  ConflictError,
  AuthenticationError,
  NotFoundError,
  AuthorizationError,
  ValidationError,
  OTPError,
} = require("../utils/errors");




class Adminservice {

  //login

static async login(data) {
  try {
    const existAdmin = await Admin.findOne({
      email: data.email,
    });

    if (!existAdmin) {
      throw new AuthorizationError(
        "email or password incorrect"
      );
    }

      if (existAdmin.loginAttempts >= 5 && existAdmin.lockUntil > new Date()) {
        throw new AuthenticationError("Account locked. Try again later");
      }

    const passCheck = await bcrypt.compare(
      data.password,
      existAdmin.password
    );

    if (!passCheck) {
     existAdmin.loginAttempts += 1;
        if (existAdmin.loginAttempts >= 5) {
          existAdmin.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        }
        await existAdmin.save();
        throw new AuthenticationError("Invalid email or password");
    }

      existAdmin.loginAttempts = 0;
      existAdmin.lockUntil = null;
      await existAdmin.save();

    const token = generateAdminToken({
      id: existAdmin._id,
      email: existAdmin.email,
    });

    logger.info(`Admin logged in: ${data.email}`, {
      adminId: existAdmin._id,
    });

    return {
      admin: existAdmin.getPublicProfile(),
      token,
      expiresIn: "7d",
    };
  } catch (error) {
    logger.error("Admin Login error:", {
      email: data.email,
      error: error.message,
    });

    throw error;
  }
}


//forgetpass
static Forgetpass = async(Email)=>{
  try{

    const admin = await Admin.findOne({email:Email})

    if(!admin){
      throw  new AuthorizationError("email not registred")
    }

 if (admin.lockUntil && admin.lockUntil > new Date()) {
      throw new AuthenticationError(
        "Account locked. Try again later"
      );
    }

    const token = Mail.generateResetToken()
    
        const resetTokenExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    admin.resetToken = token;
    admin.resetTokenExpiry = resetTokenExpiry;

    await admin.save()


        await Mail.AdminPasswordResetEmail(
          admin.email,
          token,
          admin.name
        );
    
        return true;

  }catch(error){
     logger.error("Email not registerd error:", {
      error: error.message,
    });

    throw error;

  }
}

//reset password

static async passwordReset(data) {
  try {
    const admin = await Admin.findOne({
      resetToken: data.token,
      resetTokenExpiry: { $gt: new Date() },
    });


    if (!admin) {
      throw new NotFoundError("Invalid or expired token");
    }


    const prevPassword = await bcrypt.compare(
      data.password,
      admin.password
    );

    if (prevPassword) {
      throw new ConflictError(
        "Please choose a different password. You cannot reuse your current password."
      );
    }


    admin.password = data.password;


    admin.resetToken = null;
    admin.resetTokenExpiry = null;

    await admin.save();

    logger.info(
      `Password reset successful for user: ${admin.email}`
    );

    return true;
  } catch (error) {
    logger.error("Failed to reset password", {
      error: error.message,
    });

    throw error;
  }
}

}



module.exports = Adminservice