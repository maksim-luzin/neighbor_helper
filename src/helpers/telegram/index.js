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

module.exports.deleteMessage = (request) => ({
  method: 'deleteMessage',
  body: {
    chat_id: request.message.chat.id,
    message_id: request.message.message_id,
  },
});

module.exports.editMessageReplyMarkup = (request, reply_markup) => ({
  method: 'editMessageReplyMarkup',
  body: {
    chat_id: request.message.chat.id,
    message_id: request.message.message_id,
    reply_markup,
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
