const {
  BUTTON_ABOUT_US,
  BUTTON_ADD_LOCATION,
  BUTTON_CHANGE_RANGE,
  BUTTON_FIND_ASSIGNMENT,
} = require('../constants/button.text').MAIN_MENU;

const {
  startAction,
  mainMenuAction,
  aboutUsAction,
} = require('../actions/mainActions');

const {
  findAssignmentAction,
} = require('../actions/assignmentActions');

const {
  changeRangeAction,
} = require('../actions/rangeActions');

const textHandlers = async (request) => {
  let response;
  switch (request.text) {
    case '/start':
      response = await startAction(request);
      return response;

    case BUTTON_ABOUT_US:
      return aboutUsAction();

    case BUTTON_CHANGE_RANGE:
      response = await changeRangeAction(request);
      return response;

    case BUTTON_FIND_ASSIGNMENT:
      response = await findAssignmentAction(request);
      return response;

    default:
      return mainMenuAction();
  }
};

module.exports = textHandlers;
