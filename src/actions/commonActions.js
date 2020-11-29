const { defaultMessageTemplate } = require('../templates/defaultMessageTemplate');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplate');
const { templateResponse } = require('../middlewares');

const messageDefaultAction = () => templateResponse(
  defaultMessageTemplate,
  mainMenuKeyboardTemplate,
);

module.exports = {
  messageDefaultAction,
};
