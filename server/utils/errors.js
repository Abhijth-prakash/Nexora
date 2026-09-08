// errors/AppError.js

class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific errors
class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, "VALIDATION_ERROR");
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

class AuthorizationError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409, "CONFLICT");
  }
}

class OTPError extends AppError {
  constructor(message = "Invalid or expired OTP") {
    super(message, 400, "OTP_ERROR");
  }
}

class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
  }
}

class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, 500, "DATABASE_ERROR");
  }
}

// Factory
class ErrorFactory {
  static validation(message, details) {
    return new ValidationError(message, details);
  }

  static authentication(message) {
    return new AuthenticationError(message);
  }

  static authorization(message) {
    return new AuthorizationError(message);
  }

  static notFound(message) {
    return new NotFoundError(message);
  }

  static conflict(message) {
    return new ConflictError(message);
  }

  static otp(message) {
    return new OTPError(message);
  }

  static rateLimit(message) {
    return new RateLimitError(message);
  }

  static database(message) {
    return new DatabaseError(message);
  }

  static generic(message, statusCode = 500, code = "INTERNAL_ERROR") {
    return new AppError(message, statusCode, code);
  }
}

// Error utilities
class ErrorUtils {
  static getStatusCode(error) {
    if (error instanceof AppError) {
      return error.statusCode;
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return 400;
    }

    // Mongo duplicate key
    if (error.code === 11000) {
      return 409;
    }

    // JWT errors
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return 401;
    }

    return 500;
  }

  static getMessage(error) {
    if (error instanceof AppError) {
      return error.message;
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    }

    // Mongo duplicate key
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      return `${field || "Field"} already exists`;
    }

    // JWT errors
    if (error.name === "JsonWebTokenError") {
      return "Invalid token";
    }

    if (error.name === "TokenExpiredError") {
      return "Token expired";
    }

    return error.message || "Internal server error";
  }

  static formatError(error) {
    const statusCode = this.getStatusCode(error);

    const formattedError = {
      success: false,
      error: {
        message: this.getMessage(error),
        code: error.code || this.getDefaultCode(statusCode),
        statusCode,
      },
    };

    if (error instanceof ValidationError && error.details?.length) {
      formattedError.error.details = error.details;
    }

    if (process.env.NODE_ENV === "development") {
      formattedError.error.stack = error.stack;
    }

    return formattedError;
  }

  static getDefaultCode(statusCode) {
    const codes = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      429: "TOO_MANY_REQUESTS",
      500: "INTERNAL_ERROR",
    };

    return codes[statusCode] || "INTERNAL_ERROR";
  }

static logError(error, logger, context = {}) {
  const statusCode = this.getStatusCode(error);

  const logData = {
    message: error.message,
    code: error.code,
    statusCode,
    stack: error.stack,
    ...context,
  };


  if (error instanceof ValidationError && error.details?.length) {
    logData.details = error.details;
  }

  if (error instanceof AppError && statusCode < 500) {
    logger.warn("Operational error:", logData);
  } else {
    logger.error("System error:", logData);
  }
}
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  OTPError,
  RateLimitError,
  DatabaseError,
  ErrorFactory,
  ErrorUtils,
};