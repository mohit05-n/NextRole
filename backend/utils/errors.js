class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}

class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(500, message);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError
};
