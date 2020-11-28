const locationHandler = require('./locationHandler');
const textHandler = require('./textHandler');
const callbackHandler = require('./callbackHandler');

// eslint-disable-next-line import/no-unresolved
const { messageDefaultAction } = require('../actions/commonActions');

const handlers = async (request) => {
  try {
    const { originalRequest } = request;

    if (originalRequest.message) {
      const { message } = originalRequest;

      if (message.location) {
        const response = await locationHandler(message);
        return response;
      }

      if (message.text) {
        const response = await textHandler(message);
        return response;
      }
    }

    if (originalRequest.callback_query) {
      const response = await callbackHandler(originalRequest.callback_query);
      return response;
    }

    return messageDefaultAction();
  } catch (err) {
    return messageDefaultAction();
  }
};

module.exports = handlers;
