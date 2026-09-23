const jwt = require("jsonwebtoken");
const logger = require("./logger");
const config = require("../config/config");

const generateUserToken = (payload) => {
  try {
    return jwt.sign(payload, config.JWT.USER_SECRET, {
      expiresIn: config.JWT.EXPIRES_IN,
    });
  } catch (error) {
    logger.error("Error generating user token:", error);
    throw new Error("Token generation failed");
  }
};


const verifyUserToken = (token) => {
  try {
    return jwt.verify(token, config.JWT.USER_SECRET);
  } catch (error) {
    logger.error("Token verification error:", error);
    throw error;
  }
};


const generateAdminToken = (payload) => {
  try {
    return jwt.sign(payload, config.JWT.ADMIN_SECRET, {
      expiresIn: config.JWT.EXPIRES_IN,
    });
  } catch (error) {
    logger.error("Error generating admin token:", error);
    throw new Error("Token generation failed");
  }
};


const verifyAdminToken = (token) => {
  try {
    return jwt.verify(token, config.JWT.ADMIN_SECRET);
  } catch (error) {
    logger.error("Admin Token verification error:", error);
    throw error;
  }
};

module.exports = {
    generateUserToken,
    verifyUserToken,
    generateAdminToken,
    verifyAdminToken
}