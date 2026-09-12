const {verifyUserToken} = require('../utils/validation')
const { AuthenticationError } = require("../utils/errors");

const authenticate = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new AuthenticationError("Authentication required");
  }

  const result = verifyUserToken(token);

  req.userId = result.id;

  next();
};

module.exports = {authenticate};
