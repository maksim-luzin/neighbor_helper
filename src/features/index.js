const locationHandler = require('./locationHandler');
const textHandler = require('./textHandler');
const callbackHandler = require('./callbackHandler');

const { messageDefault } = require('../controllers');

const handlers = async (request) => {
  try {
    const { originalRequest } = request;
    const { message } = originalRequest;

    if (message.location) {
      const response = await locationHandler(message);
      return response;
    }

    if (originalRequest.callback_query) {
      const response = await callbackHandler(originalRequest.callback_query, message);
      return response;
    }

    const response = await textHandler(message);
    return response;
  } catch (err) {
    return messageDefault;
  }
};

module.exports = handlers;
