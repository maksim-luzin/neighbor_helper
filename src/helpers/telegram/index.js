/* eslint-disable camelcase */
const { Text, Pause } = require('claudia-bot-builder').telegramTemplate;

module.exports.pause = (time) => new Pause(time).get();

module.exports.hideInlineKeyboard = (messageId) => ({
  method: 'editMessageReplyMarkup',
  body: {
    message_id: messageId,
    reply_markup: '{"inline_keyboard":[[]]}',
  },
});

module.exports.deleteMessage = (request, step = 0) => ({
  method: 'deleteMessage',
  body: {
    chat_id: request.from.id,
    // удаление на реплай и инлайн кнопки
    message_id: request.message ? request.message.message_id + step : request.message_id + step,
  },
});

module.exports.answerCallbackQuery = (request, text, show_alert) => ({
  method: 'answerCallbackQuery',
  body: {
    callback_query_id: request.id,
    text,
    show_alert,
  },
});

module.exports.editMessageReplyMarkup = (request, reply_markup) => ({
  method: 'editMessageReplyMarkup',
  body: {
    chat_id: request.from.id,
    message_id: request.message.message_id,
    reply_markup,
  },
});

module.exports.editMessageText = (request, reply_markup, text, parse_mode) => ({
  method: 'editMessageText',
  body: {
    chat_id: request.from.id,
    message_id: request.message.message_id,
    reply_markup,
    text,
    parse_mode: parse_mode || undefined,
  },
});

module.exports.sendPhoto = (request, reply_markup, caption, photo, parse_mode) => (
  {
    method: 'sendPhoto',
    body: {
      chat_id: request.from.id,
      caption: caption || undefined,
      photo,
      parse_mode: parse_mode || undefined,
      reply_markup,
    },
  }
);

module.exports.sendMessage = (request, reply_markup, text, parse_mode) => (
  {
    method: 'sendMessage',
    body: {
      chat_id: request.from.id,
      text,
      parse_mode: parse_mode || undefined,
      reply_markup,
    },
  }
);

module.exports.editMessageCaption = (request, reply_markup, caption, parse_mode) => ({
  method: 'editMessageCaption',
  body: {
    chat_id: request.from.id,
    message_id: request.message.message_id,
    caption,
    reply_markup,
    parse_mode: parse_mode || undefined,
  },
});

module.exports.sendText = (messageEnum, userLang, extraButton) => {
  const langEnum = userLang ? messageEnum[userLang] : messageEnum;
  const keyboard = messageEnum.keyboard || langEnum.keyboard;
  const template = new Text(langEnum.text);

  if (keyboard) {
    const keyboardButtons = [];
    const callbackPrefix = messageEnum.keyboardPrefix || '';

    // eslint-disable-next-line no-restricted-syntax
    for (const row of keyboard) {
      const newRow = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const col of row) {
        const [text, callbackData = ''] = col;

        newRow.push({
          text,
          callback_data: `${callbackPrefix}${callbackData}`,
        });
      }

      keyboardButtons.push(newRow);
    }

    if (extraButton) {
      keyboardButtons.push([{
        text: extraButton[userLang],
        callback_data: extraButton.keyboardPrefix,
      }]);
    }

    template.addInlineKeyboard(keyboardButtons);
  }

  return template.get();
};
