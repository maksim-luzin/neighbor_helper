const { telegramTemplate } = require('claudia-bot-builder');

const templateResponse = (
  templateMessage = '',
  template = false,
  inlineKeyboard = false,
) => {
  if (inlineKeyboard) {
    return (
      new telegramTemplate
        // eslint-disable-next-line new-cap
        .Text(templateMessage)
        .addInlineKeyboard(template)
        .get()
    );
  }

  if (template) {
    return (
      new telegramTemplate
        // eslint-disable-next-line new-cap
        .Text(templateMessage)
        .addReplyKeyboard(template)
        .get()
    );
  }

  return templateMessage;
};

module.exports = templateResponse;
