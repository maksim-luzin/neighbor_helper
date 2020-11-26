const { telegramTemplate } = require('claudia-bot-builder');

const responseMiddleware = (
  template = [['']],
  templateMessage = '',
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

  return (
    new telegramTemplate
      // eslint-disable-next-line new-cap
      .Text(templateMessage)
      .addReplyKeyboard(
        template,
        { one_time_keyboard: true },
      )
      .get()
  );
};

module.exorts = responseMiddleware;
