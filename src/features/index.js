const { getOne } = require('../services').userService;
const locationHandler = require('./locationHandler');
const textHandler = require('./textHandler');
const callbackQueryHandler = require('./callbackQueryHandler');

// eslint-disable-next-line import/no-unresolved
const { messageDefaultAction } = require('../actions/commonActions');

const {
  ADD_LOCATION,
} = require('../constants/flow.step').ADD_LOCATION;

const handlers = async (request) => {
  try {
    const { originalRequest } = request;
    let state = false;
    if (originalRequest.message) {
      const { message } = originalRequest;
      // eslint-disable-next-line no-use-before-define
      state = await stateLoad(message);
      if (message.location && state.step === ADD_LOCATION) {
        return await locationHandler(message, state);
      }

      if (message.text) {
        return await textHandler(message, state);
      }
    }

    if (originalRequest.callback_query) {
      return await callbackQueryHandler(originalRequest.callback_query);
    }

    return messageDefaultAction();
  } catch (err) {
    return messageDefaultAction();
  }
};

module.exports = handlers;

async function stateLoad(message) {
  const result = await getOne({ telegramId: message.from.id }, 'state');
  if (!result.succeeded) return messageDefaultAction();
  return {
    step: result.model.state.step,
    data: result.model.state.data,
    cache: result.model.state.cache,
  } || false;
}
