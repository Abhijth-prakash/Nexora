class BaseController {
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
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
}

module.exports = BaseController;