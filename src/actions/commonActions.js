const { telegramTemplate } = require('claudia-bot-builder');
const { defaultMessageTemplate } = require('../templates/defaultMessageTemplate');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplate');
const myAssignmentsFlowSteps = require('../constants/flow.step').MY_ASSIGNMENTS;
const findAssignmentsFlowSteps = require('../constants/flow.step').FIND_ASSIGNMENTS;

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

module.exports = {
  messageDefaultAction,
  paginationAction,
};
