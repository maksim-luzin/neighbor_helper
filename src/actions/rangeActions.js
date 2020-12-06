const { messageDefaultAction } = require('./commonActions');
const flowStateManager = require('../flows');
const { userService } = require('../services');

const changeRangeAction = async (message) => {
  let result;
  result = await userService.update({
    telegramId: message.from.id,
    params: {
      state: {
        flowName: 'changeRangeFlow',
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

const changeRangeNumberAction = async (callbackQuery) => {
  let result;

  const chosenRangeResult = callbackQuery.data.split('.')[1];

  result = await userService.update({
    telegramId: callbackQuery.from.id,
    params: {
      state: {
        data: {
          chosenRangeResult,
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
  changeRangeAction,
  changeRangeNumberAction,
};
