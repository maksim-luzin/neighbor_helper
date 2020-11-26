const {
  COMMAND_START,
} = require('../constants/comand');

const {
  BUTTON_DEFAULT_MENU_START,
  BUTTON_MAIN_MENU_ABOUT_US,
  BUTTON_MAIN_MENU_ADD_LOCATION,
  BUTTON_ADD_LOCATION_MENU_ADD_LOCATION_HOME,
  BUTTON_ADD_LOCATION_MENU_ADD_LOCATION_WORK,
  BUTTON_ALL_MENU_CANCEL,
} = require('../constants/button.text');

const {
  menuMain,
  messageDefault,
} = require('../controllers');

const textHandlers = async (request) => {
  switch (request.text) {
    case COMMAND_START:
      // eslint-disable-next-line no-case-declarations
      const response = await menuMain(request);
      return response;

    case BUTTON_DEFAULT_MENU_START:
      return menuMain(request);

    case BUTTON_MAIN_MENU_ABOUT_US:
      return menuMain(request);

    case BUTTON_ALL_MENU_CANCEL:
      return menuMain(request);

    default:
      return messageDefault;
  }
};

module.exports = textHandlers;
