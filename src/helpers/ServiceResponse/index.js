class ServiceResponse {
  constructor({ succeeded = false, message = '', model = null, pagingData = {} }) {
    this.succeeded = succeeded;
    this.message = message;
    this.model = model;
    this.pagingData = pagingData;
  }
}

module.exports = ServiceResponse;
