const {
  BUTTON_ABOUT_US,
  BUTTON_ADD_LOCATION,
  BUTTON_CHANGE_RANGE,
  BUTTON_MY_ASSIGNMENT,
  BUTTON_FIND_ASSIGNMENTS,
} = require('../constants/button.text').MAIN_MENU;
const {
  BUTTON_FAVORITE_ASSIGNMENTS,
  BUTTON_CREATED_ASSIGNMENTS,
} = require('../constants/button.text').MY_ASSIGNMENTS_MENU;
const {
  BUTTON_HOME,
  BUTTON_BACK,
} = require('../constants/button.text').COMMON;
const {
  BUTTON_EDUCATION,
  BUTTON_HELP,
  BUTTON_REPAIR,
  BUTTON_BARTER,
  BUTTON_OTHER,
} = require('../constants/button.text').CATEGORY;

const {
  buttonBackHandler,
  categoryHandler,
} = require('./buttonHandlers');

const {
  stateDefaultHandler,
} = require('./stateDefaultHandler');

const {
  startAction,
  mainMenuAction,
  aboutUsAction,
  showRangeAction,
  myAssignmentAction,
  addMenuAddLocationAction,
  findAssignmentsAction,
} = require('../actions/mainActions');

const {
  createdAssignmentsAction,
  favoriteAssignmentsAction,
} = require('../actions/assignmentActions');

const textHandlers = async (request, state) => {
  let response = false;
  switch (request.text) {
    case '/start':
      response = await startAction(request);
      return response;

    case BUTTON_ABOUT_US:
      return aboutUsAction();

    case BUTTON_CHANGE_RANGE:
      response = await showRangeAction(request);
      return response;

    case BUTTON_MY_ASSIGNMENT:
      return myAssignmentAction();

    case BUTTON_FIND_ASSIGNMENTS:
      response = await findAssignmentsAction(request, state);
      return response;

    case BUTTON_FAVORITE_ASSIGNMENTS:
      return favoriteAssignmentsAction(request);

    case BUTTON_CREATED_ASSIGNMENTS:
      return createdAssignmentsAction(request);

    case BUTTON_HOME:
      return mainMenuAction(request);

    case BUTTON_ADD_LOCATION:
      return addMenuAddLocationAction(request);

      // Выбор категории
      // TODO: заменить на константы, когда будет локализация
    case BUTTON_HELP:
      request.text = 'help';
      response = await categoryHandler(request, state);
      return response;
    case BUTTON_BARTER:
      request.text = 'barter';
      response = await categoryHandler(request, state);
      return response;
    case BUTTON_REPAIR:
      request.text = 'repair';
      response = await categoryHandler(request, state);
      return response;
    case BUTTON_EDUCATION:
      request.text = 'education';
      response = await categoryHandler(request, state);
      return response;
    case BUTTON_OTHER:
      request.text = 'other';
      response = await categoryHandler(request, state);
      return response;

    case BUTTON_BACK:
      response = await buttonBackHandler(request, state);
      return response;

    default:
      response = await stateDefaultHandler(request, state);
      if (response) return response;
      return mainMenuAction(request);
  }
};

module.exports = textHandlers;
