const { mainMenu, mainMenuMessage } = require('../templates/mainMenu');
const { templateResponse } = require('../middlewares');
const { COMMAND_START } = require('../constants/comand');
const { UserService } = require('../services');

const menuMain = async (message) => {
  if (message.text !== COMMAND_START) return templateResponse(mainMenu, mainMenuMessage(message));

  await UserService.addUser(message.from.id);
  return templateResponse(mainMenu, mainMenuMessage(message));
};

module.exports = menuMain;
