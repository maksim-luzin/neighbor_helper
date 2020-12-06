const { telegramTemplate } = require('claudia-bot-builder');
const { chooseCategoryKeyboardTemplate, chooseCategoryMessageTemplate } = require('../../../templates/categoryTemplate');
const { messageDefaultAction } = require('../../../actions/commonActions');

const { userService } = require('../../../services');

const chooseAssignmentCategoryFlowStep = async (request, state, flow) => {
  if (!state.data.chosenCategory
      || (flow[state.currentFlowStep] - 1 === flow.chooseAssignmentCategoryFlowStep
      && state.isPreviousFlowStepCalled)
      || flow[state.currentFlowStep] + 1 === flow.chooseAssignmentCategoryFlowStep) {
    const result = await userService.update({
      telegramId: request.from.id,
      params: {
        state: {
          currentFlowStep: 'chooseAssignmentCategoryFlowStep',
          isPreviousFlowStepCalled: false,
        },
      },
    });

    if (!result.succeeded) return messageDefaultAction();

    if (flow.chooseAssignmentCategoryFlowStep === 0 && !state.isPreviousFlowStepCalled) {
      return new telegramTemplate.Text(chooseCategoryMessageTemplate)
        .addInlineKeyboard(chooseCategoryKeyboardTemplate)
        .get();
    }

    return {
      method: 'editMessageText',
      body: {
        chat_id: request.message.chat.id,
        message_id: request.message.message_id,
        text: chooseCategoryMessageTemplate,
        reply_markup: {
          inline_keyboard: chooseCategoryKeyboardTemplate,
        },
      },
    };
  }
  return null;
};

module.exports = chooseAssignmentCategoryFlowStep;
