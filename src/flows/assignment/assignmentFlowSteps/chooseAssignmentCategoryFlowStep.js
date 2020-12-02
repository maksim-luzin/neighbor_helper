const { telegramTemplate } = require('claudia-bot-builder');
const { chooseCategoryKeyboardTemplate, chooseCategoryMessageTemplate } = require('../../../templates/categoryTemplate');

const chooseAssignmentCategoryFlowStep = (request, state, flow) => {
  if (!state.data.chosenCategory
    || (state.isLastFlowStepCalled
      && flow.indexOf(state.lastFlowStep) <= flow.indexOf(chooseAssignmentCategoryFlowStep.name))) {
    if (flow.indexOf(chooseAssignmentCategoryFlowStep.name) === 0 && !state.isLastFlowStepCalled) {
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
