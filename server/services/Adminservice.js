const Admin = require("../models/Admin");
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


class Adminservice {

}



module.exports = Adminservice