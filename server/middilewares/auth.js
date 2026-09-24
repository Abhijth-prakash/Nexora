const {
  verifyUserToken,
  verifyAdminToken
} = require("../utils/jwt");

const { AuthenticationError } = require("../utils/errors");
const logger = require("../utils/logger");
const Admin = require("../models/Admin");


const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.userToken;

    if (!token) {
      throw new AuthenticationError("Authentication required");
    }

    const result = verifyUserToken(token);

    req.userId = result.id;

    next();

  } catch (error) {
    logger.error("Failed to authenticate user", error);
    next(error);
  }
};


const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;

    if (!token) {
      throw new AuthenticationError("Authentication required");
    }

    const result = verifyAdminToken(token);

    const admin = await Admin.findById(result.id);

    if (!admin) {
      throw new AuthenticationError("Authentication required");
    }

    req.AdminId = result.id;
    req.AdminEmail = result.email;

    next();

  } catch (error) {
    logger.error("Failed to authenticate admin", error);
    next(error);
  }
};


module.exports = {
  authenticate,
  authenticateAdmin
};