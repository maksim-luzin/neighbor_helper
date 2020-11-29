const {
  BUTTON_ABOUT_US,
  BUTTON_ADD_LOCATION,
  BUTTON_CHANGE_RANGE,
} = require('../constants/button.text').MAIN_MENU;

const {
  startAction,
  mainMenuAction,
  aboutUsAction,
  showRangeAction,
} = require('../actions/mainActions');

const textHandlers = async (request) => {
  let response;
  switch (request.text) {
    case '/start':
      // eslint-disable-next-line no-case-declarations
      response = await startAction(request);
      return response;

    case BUTTON_ABOUT_US:
      return aboutUsAction();

    case BUTTON_CHANGE_RANGE:
      response = await showRangeAction(request);
      return response;

    default:
      return mainMenuAction();
  }
};

module.exports = textHandlers;
