const { messageDefaultAction } = require('./commonActions');
const { aboutUsTemplate } = require('../templates/aboutUsTemplate.js');
const { mainMenuTemplate, mainMenuMessageTemplate } = require('../templates/mainMenuTemplate');
const { templateResponse } = require('../middlewares');
const { userService } = require('../services');

const startAction = async (message) => {
  const result = await userService.create(
    {
      telegramId: message.from.id,
    },
  );

  if (!result.succeeded) return messageDefaultAction();

  const messageStart = `Здравствуй, ${message.from.first_name}\n ${aboutUsTemplate}`;
  return templateResponse(messageStart, mainMenuTemplate);
};

const mainMenuAction = () => templateResponse(mainMenuMessageTemplate, mainMenuTemplate);

const aboutUsAction = () => templateResponse(aboutUsTemplate);

module.exports = {
  startAction,
  mainMenuAction,
  aboutUsAction,
};
