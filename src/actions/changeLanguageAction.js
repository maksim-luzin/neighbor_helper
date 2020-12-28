const { telegramTemplate } = require('claudia-bot-builder');
const { CHANGE_LANGUAGE_BUTTONS } = require('../constants/button.text');
const { setState } = require('../helpers/state');
const { update } = require('../services').userService;
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplates');
const { changeLanguageSucceedMessageTemplate } = require('../templates/changeLanguageTemplates');

const changeLanguageAction = async (request, { newLocale = 'ru' }) => {
  const telegramId = request.from.id;

  const result = await update({ telegramId, newLocale });

  if (!result.succeeded) throw Error(result.message);

  return new telegramTemplate
    .Text(changeLanguageSucceedMessageTemplate)
    .addReplyKeyboard(
      mainMenuKeyboardTemplate,
      { resize_keyboard: true },
    )
    .get();
};

module.exports = { changeLanguageAction };
