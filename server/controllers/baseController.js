const logger = require('../utils/logger')
const {ValidationError} = require('../utils/errors')

class BaseController {
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }


    static validateRequest(schema, data) {
    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/['"]/g, ""),
      }));
      throw new ValidationError("Validation failed", details);
    }

    return value;
  }



  static sendSuccessResponse(
    res,
    message,
    data = null,
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static sendErrorResponse(
    res,
    message,
    statusCode = 500,
    details = null
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      details,
    });
  }


    static logAction(action, user = null, details = {}) {
    const logData = {
      action,
      timestamp: new Date().toISOString(),
      ...details,
    };

    if (user) {
      logData.user = {
        id: user._id || user.id,
        email: user.email,
      };
    }

    logger.info(`Controller Action: ${action}`, logData);
  }
}

module.exports = BaseController;