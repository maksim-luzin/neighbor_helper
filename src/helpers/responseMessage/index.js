const { telegramTemplate } = require('claudia-bot-builder');

const responseMessage = (
  message,
  messageTemplate = false,
  keyboardTemplate = false,
  photo = false,
  // eslint-disable-next-line consistent-return
) => {
  const deleteMessages = [
    {
      method: 'deleteMessage',
      body: {
        message_id: message.message_id - 1,
      },
    },
    {
      method: 'deleteMessage',
      body: {
        message_id: message.message_id,
      },
    },
  ];

  if (!keyboardTemplate && !photo) return [...deleteMessages, messageTemplate];

  if (!photo) {
    return [
      ...deleteMessages,
      new telegramTemplate
        .Text(messageTemplate)
        .addReplyKeyboard(
          keyboardTemplate,
          { one_time_keyboard: true },
        )
        // eslint-disable-next-line comma-dangle
        .get()
    ];
  }

  if (!keyboardTemplate) {
    const resPhoto = new telegramTemplate
      .Photo(
        photo,
        messageTemplate,
      )
      .get();

    resPhoto.body.parse_mode = 'Markdown';

    return [
      ...deleteMessages,
      resPhoto,
    ];
  }

  if (!messageTemplate) {
    const resPhoto = new telegramTemplate
      .Photo(photo)
      .addReplyKeyboard(
        keyboardTemplate,
        { one_time_keyboard: true },
      )
      .get();

    resPhoto.body.parse_mode = 'Markdown';

    return [
      ...deleteMessages,
      resPhoto,
    ];
  }

  const resPhoto = new telegramTemplate
    .Photo(
      photo,
      messageTemplate,
    )
    .addReplyKeyboard(
      keyboardTemplate,
      { one_time_keyboard: true },
    )
    .get();

  resPhoto.body.parse_mode = 'Markdown';

  return [
    ...deleteMessages,
    resPhoto,
  ];
};

module.exports = responseMessage;
