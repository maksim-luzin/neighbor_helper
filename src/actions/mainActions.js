const { telegramTemplate } = require('claudia-bot-builder');
const { messageDefaultAction } = require('./commonActions');
const { aboutUsMessageTemplate } = require('../templates/aboutUsTemplate');
const { mainMenuKeyboardTemplate, mainMenuMessageTemplate } = require('../templates/mainMenuTemplate');
const { rangeKeyboardTemplate, rangeMessageTemplate } = require('../templates/rangeTemplate');
const flowStateManager = require('../flows');
const { userService } = require('../services');

const startAction = async (message) => {
  const result = await userService.create(
    {
      telegramId: message.from.id,
    },
  );

  if (!result.succeeded) return messageDefaultAction();

  const messageStart = `Здравствуй, ${message.from.first_name}\n ${aboutUsMessageTemplate}`;

  return new telegramTemplate.Text(messageStart)
    .addReplyKeyboard(mainMenuKeyboardTemplate)
    .get();
};

const mainMenuAction = () => new telegramTemplate.Text(mainMenuMessageTemplate)
  .addReplyKeyboard(mainMenuKeyboardTemplate)
  .get();

const aboutUsAction = () => new telegramTemplate.Text(aboutUsMessageTemplate)
  .get();

const showRangeAction = async (message) => {
  const result = await userService.getOne({ telegramId: message.from.id, params: ['range'] });

  if (!result.succeeded) return messageDefaultAction();

  return new telegramTemplate.Text(rangeMessageTemplate(result.model.range))
    .addInlineKeyboard(rangeKeyboardTemplate)
    .get();
};

const changeRangeAction = async (callbackQuery) => {
  let result = await userService.getOne({
    telegramId: callbackQuery.from.id,
    params: ['range'],
  });

  if (!result.succeeded) return messageDefaultAction();

  let newRange = result.model.range;
  if (callbackQuery.data.split('.')[1] === '+') { // см. пояснение
    newRange = result.model.range + 1; // в src/templates/rangeTemplate/rangeKeyboardTemplate.js
  } else if (result.model.range > 1) {
    newRange = result.model.range - 1;
  }

  if (newRange === result.model.range) {
    return null;
  }

  result = await userService.update({
    telegramId: callbackQuery.from.id,
    newRange,
  });

  if (!result.succeeded) return messageDefaultAction();

  return {
    method: 'editMessageText',
    body: {
      chat_id: callbackQuery.message.chat.id,
      message_id: callbackQuery.message.message_id,
      text: rangeMessageTemplate(newRange),
      reply_markup: {
        inline_keyboard: rangeKeyboardTemplate,
      },
    },
  };
};

const goBackAction = async (request) => {
  let result;

  result = await userService.getOne({ telegramId: request.from.id, params: ['state'] });
  if (!result.succeeded) return messageDefaultAction();

  result = await userService.update({
    telegramId: request.from.id,
    updatedState: {
      isLastFlowStepCalled: true,
    },
  });

  if (!result.succeeded) return messageDefaultAction();

  result = await flowStateManager(request);
  return result;
};

module.exports = {
  startAction,
  mainMenuAction,
  aboutUsAction,
  showRangeAction,
  changeRangeAction,
  goBackAction,
};
