module.exports = class ErrorHandler extends Error {
    name = 'Controller Error';

    constructor(status, msg, code) {
        super(msg);
        this.message = msg;
        this.status = status;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
