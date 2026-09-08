const {
  AppError,
  NotFoundError,
  ConflictError,
  ValidationError,
  AuthenticationError,
  ErrorUtils,
} = require("../utils/errors");

const logger = require("../utils/logger");
const { ApiResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  ErrorUtils.logError(err, logger, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  if (err.name === "CastError") {
    const error = new NotFoundError("Resource not found");
    return ApiResponse.error(res, error);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    const error = new ConflictError(message);
    return ApiResponse.error(res, error);
  }

  if (err.name === "ValidationError" && Array.isArray(err.details)) {
    return ApiResponse.error(res, err);
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));

    const error = new ValidationError("Validation failed", errors);

    return ApiResponse.error(res, error);
  }

  if (err.name === "JsonWebTokenError") {
    const error = new AuthenticationError("Invalid token");
    return ApiResponse.error(res, error);
  }

  if (err.name === "TokenExpiredError") {
    const error = new AuthenticationError("Token expired");
    return ApiResponse.error(res, error);
  }

  if (err instanceof AppError) {
    return ApiResponse.error(res, err);
  }

  const error = new AppError(
    err.message || "Server Error",
    err.statusCode || 500
  );

  return ApiResponse.error(res, error);
};

const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;

  logger.warn(message, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  const error = new NotFoundError(message);

  return ApiResponse.error(res, error);
};

module.exports = {
  errorHandler,
  notFound,
};