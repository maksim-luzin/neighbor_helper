const { telegramTemplate } = require('claudia-bot-builder');

const templateResponse = (
  messageTemplate = '',
  keyboardTemplate = false,
  isInlineKeyboard = false,
) => {
  if (isInlineKeyboard) {
    return (
      new telegramTemplate
        // eslint-disable-next-line new-cap
        .Text(messageTemplate)
        .addInlineKeyboard(keyboardTemplate)
        .get()
    );
  }

  if (keyboardTemplate) {
    return (
      new telegramTemplate
        // eslint-disable-next-line new-cap
        .Text(messageTemplate)
        .addReplyKeyboard(keyboardTemplate)
        .get()
    );
  }

  return messageTemplate;
};

module.exports = templateResponse;
