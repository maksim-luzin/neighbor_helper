const { messageDefaultAction } = require('./commonActions');
const flowStateManager = require('../flows');
const { userService } = require('../services');

const findAssignmentAction = async (message) => {
  let result;
  result = await userService.update({
    telegramId: message.from.id,
    params: {
      state: {
        flowName: 'findAssignmentFlow',
        currentFlowStep: null,
        isPreviousFlowStepCalled: false,
        data: {},
      },
    },
    returnState: true,
  });

  if (!result.succeeded) return messageDefaultAction();

  result = await flowStateManager(message, result.model);
  return result;
};

const chooseAssignmentLocationAction = async (callbackQuery) => {
  let result;

  const chosenLocationId = callbackQuery.data.split('.')[1];

  result = await userService.update({
    telegramId: callbackQuery.from.id,
    params: {
      state: {
        data: {
          chosenLocationId,
        },
        isPreviousFlowStepCalled: false,
      },
    },
    returnState: true,
  });
  if (!result.succeeded) return messageDefaultAction();

  result = await flowStateManager(callbackQuery, result.model);
  return result;
};

const chooseAssignmentCategoryAction = async (callbackQuery) => {
  let result;

  const chosenCategory = callbackQuery.data.split('.')[1];

  result = await userService.update({
    telegramId: callbackQuery.from.id,
    params: {
      state: {
        data: {
          chosenCategory,
        },
        isPreviousFlowStepCalled: false,
      },
    },
    returnState: true,
  });

  if (!result.succeeded) return messageDefaultAction();

  result = await flowStateManager(callbackQuery, result.model);
  return result;
};

module.exports = {
  findAssignmentAction,
  chooseAssignmentCategoryAction,
  chooseAssignmentLocationAction,
};
