const { getOne } = require('../services').userService;
const locationHandler = require('./locationHandler');
const textHandler = require('./textHandler');
const callbackQueryHandler = require('./callbackQueryHandler');
const { messageDefaultAction } = require('../actions/commonActions');
const { create } = require('../services').userService;
const pictureHandler = require('./pictureHandler');

const { ADD_LOCATION, ADD_ASSIGNMENT } = require('../constants/flow.step');

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

      if (message.photo && state.step === ADD_ASSIGNMENT.SHOW_ASSIGNMENT) {
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
  }
};

module.exports = handlers;

async function stateLoad(message) {
  if (message.text === '/start') return { data: '', step: '', cache: '' };

  const result = await getOne({ telegramId: message.from.id, params: ['state'] });
  if (!result.succeeded) throw Error(result.message);

  if (!result.model) {
    const resultCreate = await create({
      telegramId: message.from.id,
    });

    if (!resultCreate.succeeded) throw Error(resultCreate.message);
    throw Error("State haven't found");
  }

  return {
    step: result.model.state.step || '',
    data: result.model.state.data || '',
    cache: result.model.state.cache || '',
  };
}
