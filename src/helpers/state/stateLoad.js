const { getOne, create } = require('../../services').userService;

const stateLoad = async (message) => {
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
  const response = {
    step: result.model.state.step || '',
    data: result.model.state.data || '',
    cache: result.model.state.cache || '',
  };

  return response;
};

module.exports = stateLoad;
