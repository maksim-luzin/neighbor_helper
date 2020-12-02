const { messageDefaultAction } = require('./commonActions');
const flowStateManager = require('../flows');
const { userService } = require('../services');

const findAssignmentAction = async (message) => {
  let result;
  result = await userService.update({
    telegramId: message.from.id,
    updatedState: {
      flowName: 'findAssignmentFlow',
      lastFlowStep: null,
      isLastFlowStepCalled: false,
      data: {},
    },
  });

  if (!result.succeeded) return messageDefaultAction();

  result = await flowStateManager(message);
  return result;
};

const chooseAssignmentLocationAction = async (callbackQuery) => {
  let result;

  result = await userService.getOne({ telegramId: callbackQuery.from.id, params: ['state'] });
  if (!result.succeeded) return messageDefaultAction();

  const chosenLocationId = callbackQuery.data.split('.')[1];

  result = await userService.update({
    telegramId: callbackQuery.from.id,
    updatedState: {
      lastFlowStep: 'chooseAssignmentLocationFlowStep',
      data: { ...result.model.state.data, chosenLocationId },
      isLastFlowStepCalled: false,
    },
  });
  if (!result.succeeded) return messageDefaultAction();

  result = await flowStateManager(callbackQuery);
  return result;
};

const chooseAssignmentCategoryAction = async (callbackQuery) => {
  let result;

  result = await userService.getOne({ telegramId: callbackQuery.from.id, params: ['state'] });
  if (!result.succeeded) return messageDefaultAction();

  const chosenCategory = callbackQuery.data.split('.')[1];

  result = await userService.update({
    telegramId: callbackQuery.from.id,
    updatedState: {
      lastFlowStep: 'chooseAssignmentCategoryFlowStep',
      data: { ...result.model.state.data, chosenCategory },
      isLastFlowStepCalled: false,
    },
  });

  if (!result.succeeded) return messageDefaultAction();

  result = await flowStateManager(callbackQuery);
  return result;
};

module.exports = {
  findAssignmentAction,
  chooseAssignmentCategoryAction,
  chooseAssignmentLocationAction,
};
