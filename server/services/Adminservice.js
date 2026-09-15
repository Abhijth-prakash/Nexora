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

    const passCheck = await bcrypt.compare(
      data.password,
      existAdmin.password
    );

    if (!passCheck) {
      throw new AuthorizationError(
        "email or password incorrect"
      );
    }

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

}



module.exports = Adminservice