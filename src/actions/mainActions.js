const { defaultMessageTemplate } = require('../templates/defaultMessageTemplate');
const { aboutUsTemplate } = require('../templates/aboutUsTemplate.js');
const { mainMenuTemplate, mainMenuMessageTemplate } = require('../templates/mainMenuTemplate');
const { templateResponse } = require('../middlewares');
const { userService } = require('../services');

const startAction = async (message) => {
  await userService.create(
    {
      telegramId: message.from.id,
    },
  );

  const messageStart = `Здравствуй ${message.from.first_name}\n ${aboutUsTemplate}`;
  return templateResponse(messageStart, mainMenuTemplate);
};

const messageDefaultAction = () => templateResponse(defaultMessageTemplate, mainMenuTemplate);

const mainMenuAction = () => templateResponse(mainMenuMessageTemplate, mainMenuTemplate);

const aboutUsAction = () => templateResponse(aboutUsTemplate);

module.exports = {
  startAction,
  messageDefaultAction,
  mainMenuAction,
  aboutUsAction,
};
