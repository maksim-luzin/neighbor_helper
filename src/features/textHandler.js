const {
  MAIN_MENU_BUTTONS,
  MY_ASSIGNMENTS_MENU_BUTTONS,
  COMMON_BUTTONS,
  CATEGORY_BUTTONS,
  ADD_ASSIGNMENT_BUTTONS,
  CHANGE_LANGUAGE_BUTTONS,
} = require('../constants/button.text');

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
  chooseLanguageAction,
  findAssignmentsAction,
  addMenuSelectCategoryForCreatedAssignmentAction,
} = require('../actions/mainActions');

const { addMenuAddLocationAction } = require('../actions/commonActions');

const {
  createdAssignmentsAction,
  favoriteAssignmentsAction,
} = require('../actions/assignmentActions');

const {
  buttonEditAssignmentHandler,
  buttonPublishAssignmentHandler,
} = require('./buttonHandlers');

const textHandlers = async (request, state) => {
  switch (request.text) {
    case '/start':
      return startAction(request);

    case MAIN_MENU_BUTTONS.ABOUT_US:
      return aboutUsAction(request);

    case MAIN_MENU_BUTTONS.CHANGE_RANGE:
      return showRangeAction(request);

    case MAIN_MENU_BUTTONS.MY_ASSIGNMENT:
      return myAssignmentAction();

    case MAIN_MENU_BUTTONS.FIND_ASSIGNMENTS:
      return findAssignmentsAction(request, state);

    case MAIN_MENU_BUTTONS.LANGUAGE:
      return chooseLanguageAction(request);

    case MY_ASSIGNMENTS_MENU_BUTTONS.FAVORITE_ASSIGNMENTS:
      return favoriteAssignmentsAction(request);

    case MY_ASSIGNMENTS_MENU_BUTTONS.CREATED_ASSIGNMENTS:
      return createdAssignmentsAction(request);

    case COMMON_BUTTONS.HOME:
      return mainMenuAction(request);

    case COMMON_BUTTONS.ADD_LOCATION:
      return addMenuAddLocationAction(request, state);

    case COMMON_BUTTONS.BACK:
      return buttonBackHandler(request, state);

    // Выбор категории
    // TODO: заменить на константы, когда будет локализация
    case CATEGORY_BUTTONS.HELP:
      request.text = 'help';
      return categoryHandler(request, state);

    case CATEGORY_BUTTONS.BARTER:
      request.text = 'barter';
      return categoryHandler(request, state);

    case CATEGORY_BUTTONS.REPAIR:
      request.text = 'repair';
      return categoryHandler(request, state);

    case CATEGORY_BUTTONS.EDUCATION:
      request.text = 'education';
      return categoryHandler(request, state);

    case CATEGORY_BUTTONS.OTHER:
      request.text = 'other';
      return categoryHandler(request, state);

    case MAIN_MENU_BUTTONS.ADD_ASSIGNMENT:
      return addMenuSelectCategoryForCreatedAssignmentAction(request, state);

    case ADD_ASSIGNMENT_BUTTONS.PUBLISH_ASSIGNMENT:
      return buttonPublishAssignmentHandler(request, state);

    case COMMON_BUTTONS.EDIT_ASSIGNMENT:
      return buttonEditAssignmentHandler(request, state);

    default:
      // eslint-disable-next-line no-case-declarations
      const response = await stateDefaultHandler(request, state);
      if (response) return response;
      return mainMenuAction(request);
  }
};

module.exports = textHandlers;
