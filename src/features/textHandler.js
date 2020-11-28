const {
  BUTTON_ABOUT_US,
  BUTTON_ADD_LOCATION,
} = require('../constants/button.text').MAIN_MENU;

const {
  startAction,
  mainMenuAction,
  aboutUsAction,
} = require('../actions/mainActions');

const textHandlers = async (request) => {
  switch (request.text) {
    case '/start':
      // eslint-disable-next-line no-case-declarations
      const response = await startAction(request);
      return response;

    case BUTTON_ABOUT_US:
      return aboutUsAction();

    default:
      return mainMenuAction();
  }
};

module.exports = textHandlers;
