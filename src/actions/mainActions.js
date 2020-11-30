const { messageDefaultAction } = require('./commonActions');
const { aboutUsMessageTemplate } = require('../templates/aboutUsTemplate.js');
const { mainMenuKeyboardTemplate, mainMenuMessageTemplate } = require('../templates/mainMenuTemplate');
const { rangeKeyboardTemplate, rangeMessageTemplate } = require('../templates/rangeTemplate');
const { templateResponse } = require('../middlewares');
const { userService } = require('../services');

const startAction = async (message) => {
  const result = await userService.create(
    {
      telegramId: message.from.id,
    },
  );

  if (!result.succeeded) return messageDefaultAction();

  const messageStart = `Здравствуй, ${message.from.first_name}\n ${aboutUsMessageTemplate}`;
  return templateResponse(messageStart, mainMenuKeyboardTemplate);
};

const mainMenuAction = () => templateResponse(mainMenuMessageTemplate, mainMenuKeyboardTemplate);

const aboutUsAction = () => templateResponse(aboutUsMessageTemplate);

const showRangeAction = async (message) => {
  const result = await userService.getOne({ telegramId: message.from.id, params: ['range'] });

  if (!result.succeeded) return messageDefaultAction();

  return templateResponse(
    rangeMessageTemplate(result.model.range),
    rangeKeyboardTemplate,
    true,
  );
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

module.exports = {
  startAction,
  mainMenuAction,
  aboutUsAction,
  showRangeAction,
  changeRangeAction,
};
