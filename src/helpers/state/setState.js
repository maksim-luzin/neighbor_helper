const { update } = require('../../services').userService;

const setState = async (
  telegramId,
  step = '',
  data = '',
  cache = '',
  transaction,
) => {
  const updatedState = {
    step,
    cache,
    data,
  };
  const result = await update(
    {
      telegramId,
      updatedState,
    },
    transaction,
  );
  if (!result.succeeded) throw Error(result.message);
};

module.exports = setState;
