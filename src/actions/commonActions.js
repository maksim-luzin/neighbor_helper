/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
const { telegramTemplate } = require('claudia-bot-builder');
const { defaultMessageTemplate } = require('../templates/defaultMessageTemplate');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplate');
const myAssignmentsFlowSteps = require('../constants/flow.step').MY_ASSIGNMENTS;
const findAssignmentsFlowSteps = require('../constants/flow.step').FIND_ASSIGNMENTS;
const { setState } = require('../helpers/state');
const responseMessage = require('../helpers/responseMessage');
const {
  addLocationMessageTemplate,
  addLocationKeyboardTemplate,
} = require('../templates/locationTemplates');

const {
  ADD_LOCATION,
  ADD_ASSIGNMENT,
  EDIT_ASSIGNMENT,
  FIND_ASSIGNMENTS,
} = require('../constants/flow.step');

const { BUTTON_BACK } = require('../constants/button.text').COMMON;

const {
  favoriteAssignmentsAction,
  createdAssignmentsAction,
  addFoundAssignmentLocationAction,
} = require('./assignmentActions');

const messageDefaultAction = () => (
  new telegramTemplate
    .Text(defaultMessageTemplate)
    .addReplyKeyboard(
      mainMenuKeyboardTemplate,
      { one_time_keyboard: true },
    )
    .get());

const paginationAction = async (request, page, state) => {
  let response;
  switch (state.step) {
    case myAssignmentsFlowSteps.GET_CREATED_ASSIGNMENTS:
      response = await createdAssignmentsAction(request, page, state);

      break;
    case myAssignmentsFlowSteps.GET_FAVORITE_ASSIGNMENTS:
      response = await favoriteAssignmentsAction(request, page, state);

      break;
    case findAssignmentsFlowSteps.GET_ASSIGNMENTS:
      response = await addFoundAssignmentLocationAction({ request, page, state });

      break;
    default:
      response = messageDefaultAction();
  }
  return response;
};

const addMenuAddLocationAction = async (message, state) => {
  // eslint-disable-next-line no-use-before-define
  let cache;
  if (message.text === BUTTON_BACK) {
    cache = state.cache;
  } else {
    cache = {
      stepToReturn: state.step,
      data: state.data,
      cache: state.cache,
    };
  }
  await setState(
    message.from.id,
    ADD_LOCATION.ADD_LOCATION,
    null,
    cache,
  );

  return responseMessage(
    message,
    addLocationMessageTemplate,
    addLocationKeyboardTemplate,
    null,
    null,
    countMessagesDelete(state),
  );
};

module.exports = {
  messageDefaultAction,
  paginationAction,
  addMenuAddLocationAction,
};

function countMessagesDelete(state) {
  switch (state.step) {
    case ADD_LOCATION.ADD_LOCATION_NAME:
    case FIND_ASSIGNMENTS.CHOOSE_LOCATION:
      return 2;

    case ADD_ASSIGNMENT.CHOOSE_LOCATION:
    case EDIT_ASSIGNMENT.CHOOSE_LOCATION:
      return 3;

    default:
      return 1;
  }
}
