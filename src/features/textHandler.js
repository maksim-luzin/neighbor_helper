const {
  BUTTON_ABOUT_US,
  BUTTON_CHANGE_RANGE,
  BUTTON_MY_ASSIGNMENT,
  BUTTON_FIND_ASSIGNMENTS,
  BUTTON_ADD_ASSIGNMENT,
} = require('../constants/button.text').MAIN_MENU;
const {
  BUTTON_FAVORITE_ASSIGNMENTS,
  BUTTON_CREATED_ASSIGNMENTS,
} = require('../constants/button.text').MY_ASSIGNMENTS_MENU;
const {
  BUTTON_HOME,
  BUTTON_BACK,
  EDIT_ASSIGNMENT,
  BUTTON_ADD_LOCATION,
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
  findAssignmentsAction,
  addMenuSelectCategoryForCreatedAssignmentAction,
} = require('../actions/mainActions');

const { addMenuAddLocationAction } = require('../actions/locationAction');

const {
  createdAssignmentsAction,
  favoriteAssignmentsAction,
} = require('../actions/assignmentActions');

const {
  buttonEditAssignmentHandler,
  buttonPublishAssignmentHandler,
} = require('./buttonHandlers');

const {
  PUBLISH_ASSIGNMENT,
} = require('../constants/button.text').ADD_ASSIGNMENT;

const textHandlers = async (request, state) => {
  switch (request.text) {
    case '/start':
      return startAction(request);

    case BUTTON_ABOUT_US:
      return aboutUsAction(request);

    case BUTTON_CHANGE_RANGE:
      return showRangeAction(request);

    case BUTTON_MY_ASSIGNMENT:
      return myAssignmentAction();

    case BUTTON_FIND_ASSIGNMENTS:
      return findAssignmentsAction(request, state);

    case BUTTON_FAVORITE_ASSIGNMENTS:
      return favoriteAssignmentsAction(request);

    case BUTTON_CREATED_ASSIGNMENTS:
      return createdAssignmentsAction(request);

    case BUTTON_HOME:
      return mainMenuAction(request);

    case BUTTON_ADD_LOCATION:
      return addMenuAddLocationAction(request, state);

    case BUTTON_BACK:
      return buttonBackHandler(request, state);

    // Выбор категории
    // TODO: заменить на константы, когда будет локализация
    case BUTTON_HELP:
      request.text = 'help';
      return categoryHandler(request, state);

    case BUTTON_BARTER:
      request.text = 'barter';
      return categoryHandler(request, state);

    case BUTTON_REPAIR:
      request.text = 'repair';
      return categoryHandler(request, state);

    case BUTTON_EDUCATION:
      request.text = 'education';
      return categoryHandler(request, state);

    case BUTTON_OTHER:
      request.text = 'other';
      return categoryHandler(request, state);

    case BUTTON_ADD_ASSIGNMENT:
      return addMenuSelectCategoryForCreatedAssignmentAction(request, state);

    case PUBLISH_ASSIGNMENT:
      return buttonPublishAssignmentHandler(request, state);

    case EDIT_ASSIGNMENT:
      return buttonEditAssignmentHandler(request, state);

    default:
      // eslint-disable-next-line no-case-declarations
      const response = await stateDefaultHandler(request, state);
      if (response) return response;
      return mainMenuAction(request);
  }
};

module.exports = textHandlers;
