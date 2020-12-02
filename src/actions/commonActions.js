const { telegramTemplate } = require('claudia-bot-builder');
const { defaultMessageTemplate } = require('../templates/defaultMessageTemplate');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplate');

const messageDefaultAction = () => new telegramTemplate.Text(defaultMessageTemplate)
  .addReplyKeyboard(mainMenuKeyboardTemplate)
  .get();

module.exports = {
  messageDefaultAction,
};
