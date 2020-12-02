const locationHandler = require('./locationHandler');
const textHandler = require('./textHandler');
const callbackQueryHandler = require('./callbackQueryHandler');

const { messageDefaultAction } = require('../actions/commonActions');
const { mainMenuAction } = require('../actions/mainActions');

const handlers = async (request) => {
  try {
    const { originalRequest } = request;

    if (originalRequest.message) {
      const { message } = originalRequest;

      if (message.location) {
        return await locationHandler(message);
      }

      if (message.text) {
        return await textHandler(message);
      }
    }

    if (originalRequest.callback_query) {
      return await callbackQueryHandler(originalRequest.callback_query);
    }

    return mainMenuAction();
  } catch (err) {
    return messageDefaultAction();
  }
};

module.exports = handlers;
