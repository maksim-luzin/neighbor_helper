const { mainMenu, mainMenuMessage } = require('../templates/mainMenu');
const { templateResponse } = require('../middlewares');
const { COMMAND_START } = require('../constants/comand');
const { userService } = require('../services');

const menuMain = async (message) => {
  if (message.text !== COMMAND_START) return templateResponse(mainMenu, mainMenuMessage(message));

  await userService.create({telegramId: message.from.id});
  return templateResponse(mainMenu, mainMenuMessage(message));
};

module.exports = menuMain;
