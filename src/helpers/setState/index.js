const { update } = require('../../services').userService;

const setState = async (
  telegramId,
  step = '',
  data = '',
  cache = '',
) => {
  const updatedState = {
    step,
    cache,
    data,
  };
  const result = await update({
    telegramId,
    updatedState,
  });
  if (!result.succeeded) throw Error(result.message);
};

module.exports = setState;
