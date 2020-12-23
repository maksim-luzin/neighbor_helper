/* eslint-disable no-plusplus */
/* eslint-disable for-direction */
const { telegramTemplate } = require('claudia-bot-builder');
const assignmentMessage = require('./assignmentMessage');

const responseMessage = (
  message,
  messageTemplate = null,
  keyboardTemplate = null,
  photo = null,
  template = null,
  numberMessageForDelete = 1,
  // eslint-disable-next-line consistent-return
) => {
  let pictureUrl;
  let assignment;
  if (template) {
    const response = assignmentMessage(template);
    pictureUrl = response.pictureUrl;
    assignment = response.assignment;
  }

  const deleteMessages = () => {
    let response = [];

    for (let i = numberMessageForDelete - 1; i >= 0; --i) {
      response = [
        ...response,
        {
          method: 'deleteMessage',
          body: {
            message_id: message.message_id - i,
          },
        },
      ];
    }

    return response;
  };

  if (!photo && !assignment) {
    return [
      ...deleteMessages(),
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

  if (!assignment) {
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
      ...deleteMessages(),
      resPhoto,
    ];
  }

  if (template && !template.pictureUrl) {
    return [
      ...deleteMessages(),
      new telegramTemplate
        .Text(assignment)
        .get(),
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

  if (template && template.pictureUrl) {
    const resPhoto = new telegramTemplate
      .Photo(
        template.pictureUrl,
        assignment,
      )
      .get();
    resPhoto.body.parse_mode = 'Markdown';

    return [
      ...deleteMessages(),
      resPhoto,
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
};

module.exports = responseMessage;
