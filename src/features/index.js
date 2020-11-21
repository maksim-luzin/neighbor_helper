const textHandler = require('./text');
const defaultHandler = require('./default');
const locationHandler = require('./location');
const callbackQueryHandler = require('./callback-query');

const { logger } = require('../helpers');

module.exports = async (webhook) => {
  logger.info(webhook);

  const { message, callback_query: callbackQuery } = webhook.originalRequest;

  if (message) {
    if (message.text) {
      return textHandler(message);
    }
    if (message.location) {
      return locationHandler(message);
    }
  } else if (callbackQuery) {
    return callbackQueryHandler(callbackQuery);
  }

  return defaultHandler();
};
