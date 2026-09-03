const { ErrorUtils, AppError } = require("./errors");

class ApiResponse {
  static success(res, message, data = null, statusCode = 200, meta = null) {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || null,
    };

    if (data !== null) {
      response.data = data;
    }

    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  static error(res, error, statusCode = null) {
    const formattedError = ErrorUtils.formatError(error);

    const finalStatusCode =
      statusCode !== null
        ? statusCode
        : formattedError.error.statusCode;

    const response = {
      ...formattedError,
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || null,
    };

    return res.status(finalStatusCode).json(response);
  }

  static validationError(res, validationResult) {
    const errors = validationResult.error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
      value: detail.context?.value,
    }));

    return res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details: errors,
      },
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || null,
    });
  }

  static paginated(res, message, data, pagination) {
    return this.success(res, message, data, 200, {
      pagination: {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalItems:
          pagination.totalItems || pagination.totalUsers,
        itemsPerPage: pagination.limit,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage,
      },
    });
  }

  static file(res, filePath, filename = null, options = {}) {
    const downloadOptions = {
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
      ...options,
    };

    if (filename) {
      downloadOptions.headers["content-disposition"] =
        `attachment; filename="${filename}"`;
    }

    return res.download(
      filePath,
      filename,
      downloadOptions,
      (err) => {
        if (err) {
          return this.error(res, err);
        }
      }
    );
  }

  static created(res, message, data = null) {
    return this.success(res, message, data, 201);
  }

  static accepted(res, message, data = null) {
    return this.success(res, message, data, 202);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static notFound(res, message = "Resource not found") {
    return this.error(res, new AppError(message, 404));
  }

  static unauthorized(res, message = "Authentication required") {
    return this.error(res, new AppError(message, 401));
  }

  static forbidden(res, message = "Access denied") {
    return this.error(res, new AppError(message, 403));
  }
}

const sendSuccess = (
  res,
  message,
  data = null,
  statusCode = 200
) => {
  return ApiResponse.success(
    res,
    message,
    data,
    statusCode
  );
};

const sendError = (
  res,
  message,
  statusCode = 500,
  details = null
) => {
  const error = new AppError(message, statusCode);

  if (details) {
    error.details = details;
  }

  return ApiResponse.error(res, error, statusCode);
};

const sendValidationError = (res, validationResult) => {
  return ApiResponse.validationError(
    res,
    validationResult
  );
};

module.exports = {
  ApiResponse,
  sendSuccess,
  sendError,
  sendValidationError,
};