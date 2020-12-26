const { telegramTemplate } = require('claudia-bot-builder');
const { defaultMessageTemplate } = require('../templates/defaultMessageTemplates');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplates');
const {
  addLocationMessageTemplate,
  addLocationKeyboardTemplate,
} = require('../templates/locationTemplates');

const responseMessage = require('../helpers/responseMessage');

const { setState } = require('../helpers/state');

const {
  ADD_LOCATION_FLOW_STEPS,
  ADD_ASSIGNMENT_FLOW_STEPS,
  EDIT_ASSIGNMENT_FLOW_STEPS,
  FIND_ASSIGNMENTS_FLOW_STEPS,
  MY_ASSIGNMENTS_FLOW_STEPS,
} = require('../constants/flow.step');

const { COMMON_BUTTONS } = require('../constants/button.text');

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
    case MY_ASSIGNMENTS_FLOW_STEPS.GET_CREATED_ASSIGNMENTS:
      response = await createdAssignmentsAction(request, page, state);

      break;
    case MY_ASSIGNMENTS_FLOW_STEPS.GET_FAVORITE_ASSIGNMENTS:
      response = await favoriteAssignmentsAction(request, page, state);

      break;
    case FIND_ASSIGNMENTS_FLOW_STEPS.GET_ASSIGNMENTS:
      response = await addFoundAssignmentLocationAction({ request, page, state });

      break;
    default:
      response = messageDefaultAction();
  }
  return response;
};

const addMenuAddLocationAction = async (message, state) => {
  let cache;
  if (message.text === COMMON_BUTTONS.BACK) {
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
    ADD_LOCATION_FLOW_STEPS.ADD_LOCATION,
    null,
    cache,
  );

  return responseMessage(
    message,
    addLocationMessageTemplate,
    addLocationKeyboardTemplate,
    null,
    null,
    // eslint-disable-next-line no-use-before-define
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
    case ADD_LOCATION_FLOW_STEPS.ADD_LOCATION_NAME:
    case FIND_ASSIGNMENTS_FLOW_STEPS.CHOOSE_LOCATION:
      return 2;

    case ADD_ASSIGNMENT_FLOW_STEPS.CHOOSE_LOCATION:
    case EDIT_ASSIGNMENT_FLOW_STEPS.CHOOSE_LOCATION:
      return 3;

    default:
      return 1;
  }
}
