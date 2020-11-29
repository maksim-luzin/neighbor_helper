const { messageDefaultAction } = require('./commonActions');
const { aboutUsMessageTemplate } = require('../templates/aboutUsTemplate.js');
const { mainMenuKeyboardTemplate, mainMenuMessageTemplate } = require('../templates/mainMenuTemplate');
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

module.exports = {
  startAction,
  mainMenuAction,
  aboutUsAction,
};
