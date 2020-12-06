// Это пример, который нигде не используется!
// Чтобы его можно было использовать, необходимо создать экшен, который будет добавлять
// chosenReward в state.data, после чего импортировать этот FlowStep в нужный Flow

const { telegramTemplate } = require('claudia-bot-builder');
const { rewardKeyboardTemplate, rewardMessageTemplate } = require('../../../templates/rewardTemplate');
const { messageDefaultAction } = require('../../../actions/commonActions');

const { userService } = require('../../../services');

const enterAssignmentRewardFlowStep = async (request, state, flow) => {
  if (!state.data.chosenReward
    || (flow[state.currentFlowStep] - 1 === flow.enterAssignmentRewardFlowStep
      && state.isPreviousFlowStepCalled)
    || flow[state.currentFlowStep] + 1 === flow.enterAssignmentRewardFlowStep) {
    const result = await userService.update({
      telegramId: request.from.id,
      params: {
        state: {
          currentFlowStep: 'enterAssignmentRewardFlowStep',
          isPreviousFlowStepCalled: false,
        },
      },
    });

    if (!result.succeeded) return messageDefaultAction();

    if (flow.enterAssignmentRewardFlowStep === 0 && !state.isPreviousFlowStepCalled) {
      return new telegramTemplate.Text(rewardMessageTemplate)
        .addInlineKeyboard(rewardKeyboardTemplate)
        .get();
    }

    return {
      method: 'editMessageText',
      body: {
        chat_id: request.message.chat.id,
        message_id: request.message.message_id,
        text: rewardMessageTemplate,
        reply_markup: {
          inline_keyboard: rewardKeyboardTemplate,
        },
      },
    };
  }
  return null;
};

module.exports = enterAssignmentRewardFlowStep;
