/* eslint-disable consistent-return */
const locationHandler = require('./locationHandler');
const textHandler = require('./textHandler');
const callbackQueryHandler = require('./callbackQueryHandler');
const { messageDefaultAction } = require('../actions/commonActions');
const pictureHandler = require('./pictureHandler');
const { stateLoad } = require('../helpers/state');

const { ADD_LOCATION } = require('../constants/flow.step');

const handlers = async ({ originalRequest }) => {
  try {
    let state = {
      data: '',
      step: '',
      cache: '',
    };
    if (originalRequest.message) {
      const { message } = originalRequest;
      // eslint-disable-next-line no-use-before-define
      state = await stateLoad(message);
      if (message.location && state.step === ADD_LOCATION.ADD_LOCATION) {
        return await locationHandler(message, state);
      }

      if (message.photo) {
        return await pictureHandler(message, state);
      }

      if (message.text) {
        return await textHandler(message, state);
      }
    }

    if (originalRequest.callback_query) {
      // eslint-disable-next-line no-use-before-define
      state = await stateLoad(originalRequest.callback_query);
      return await callbackQueryHandler(originalRequest.callback_query, state);
    }

    return messageDefaultAction();
  } catch (err) {
    console.error(err.name);
    console.error(err.message);
    console.error(err.stack);
    return messageDefaultAction();
};

module.exports = handlers;