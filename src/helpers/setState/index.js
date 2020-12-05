const { update } = require('../../services').userService;
const { messageDefaultAction } = require('../../actions/commonActions');

// eslint-disable-next-line consistent-return
const setState = async (
  telegramId,
  step = '',
  data = '',
  cache = '',
  // eslint-disable-next-line consistent-return
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
  if (!result.succeeded) return messageDefaultAction();
};

module.exports = setState;
