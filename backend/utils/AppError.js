// error with a status code, so the error handler knows what to send back
class AppError extends Error {
  constructor(message, statusCode, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

module.exports = AppError;
