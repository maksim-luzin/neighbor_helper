class ServiceResponse {
    constructor( { succeeded = false, message = '', model = null } ) {
        this.succeeded = succeeded;
        this.message = message;
        this.model = model;
    }
}

module.exports = ServiceResponse;
