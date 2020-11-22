module.exports = class ErrorHandler extends Error {
  constructor(status, msg, code) {
    super(msg);

    this.name = 'Controller Error';
    this.message = msg;
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
};
