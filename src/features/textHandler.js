const {
  BUTTON_ABOUT_US,
  BUTTON_ADD_LOCATION,
  BUTTON_CHANGE_RANGE,
  BUTTON_MY_ASSIGNMENT,
} = require('../constants/button.text').MAIN_MENU;
const {
  BUTTON_FAVORITE_ASSIGNMENTS,
  BUTTON_CREATED_ASSIGNMENTS,
} = require('../constants/button.text').MY_ASSIGNMENTS_MENU;
const { BUTTON_HOME } = require('../constants/button.text').COMMON;

const {
  startAction,
  mainMenuAction,
  aboutUsAction,
  showRangeAction,
  myAssignmentAction,
} = require('../actions/mainActions');

const { createdAssignmentsAction, favoriteAssignmentsAction } = require('../actions/myAssignmentAction');

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

    case BUTTON_MY_ASSIGNMENT:
      return myAssignmentAction();

    case BUTTON_FAVORITE_ASSIGNMENTS:
      return favoriteAssignmentsAction(request);

    case BUTTON_CREATED_ASSIGNMENTS:
      return createdAssignmentsAction(request);

    case BUTTON_HOME:
      return mainMenuAction();

    default:
      return mainMenuAction();
  }
};

module.exports = textHandlers;
