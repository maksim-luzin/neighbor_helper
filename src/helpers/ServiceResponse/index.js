class ServiceResponse {
    succeeded = false;
    message = '';
    model = {};

    constructor(succeeded, message, model) {
        this.succeeded = succeeded;
        this.message = message;
        this.model = model;
    }

    static ResultServiceResponse(succeeded) {
        return new ServiceResponse(succeeded, '', {});
    }

    static ResultAndMessageServiceResponse(succeeded, message) {
        return new ServiceResponse(succeeded, message, {});
    }
}

module.exports = ServiceResponse;
