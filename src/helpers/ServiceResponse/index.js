class ServiceResponse {
    succeeded = false;
    message = '';
    model = null;

    constructor( { succeeded, message, model } ) {
        this.succeeded = succeeded || succeeded;
        this.message = message || this.message;
        this.model = model || this.model;
    }
}

module.exports = ServiceResponse;
