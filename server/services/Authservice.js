const Users = require("../models/User");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const {
  ConflictError,
  AuthenticationError,
  NotFoundError,
  AuthorizationError,
  ValidationError,
  OTPError,
} = require("../utils/errors");

class AuthService {
  static async register(userData) {
    try {
      const existingUser = await Users.findOne({
        email: userData.email,
      });

      if (existingUser) {
        throw new ConflictError("email already exists");
      }

      const hashPass = await bcrypt.hash(userData.password, 12);

      const user = await Users.create({
        name: userData.name,
        email: userData.email,
        password: hashPass,
      });

      return user;
    } catch (error) {
      logger.error("Something went wrong while registering user", error);
      throw error;
    }
  }
}

module.exports = AuthService;