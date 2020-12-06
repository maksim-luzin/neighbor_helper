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

const goBackAction = async (request) => {
  let result;

  result = await userService.getOne({ telegramId: request.from.id, params: ['state'] });
  if (!result.succeeded) return messageDefaultAction();

  result = await userService.update({
    telegramId: request.from.id,
    params: {
      state: {
        isPreviousFlowStepCalled: true,
      },
    },
    returnState: true,
  });

  if (!result.succeeded) return messageDefaultAction();

  result = await flowStateManager(request, result.model);
  return result;
};

module.exports = {
  startAction,
  mainMenuAction,
  aboutUsAction,
  goBackAction,
};
