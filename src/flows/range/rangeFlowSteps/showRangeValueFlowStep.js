const { telegramTemplate } = require('claudia-bot-builder');
const { rangeKeyboardTemplate, rangeMessageTemplate } = require('../../../templates/rangeTemplate');
const { messageDefaultAction } = require('../../../actions/commonActions');

const { userService } = require('../../../services');

const showRangeValueFlowStep = async (request, state, flow) => {
  if (!state.data.chosenRangeResult
    || (flow[state.currentFlowStep] - 1 === flow.showRangeValueFlowStep
      && state.isPreviousFlowStepCalled)
    || flow[state.currentFlowStep] + 1 === flow.showRangeValueFlowStep) {
    let result;

    result = await userService.update({
      telegramId: request.from.id,
      params: {
        state: {
          currentFlowStep: 'showRangeValueFlowStep',
          isPreviousFlowStepCalled: false,
        },
      },
    });

    if (!result.succeeded) return messageDefaultAction();

    result = await userService.getOne({
      telegramId: request.from.id,
      params: ['range'],
    });

    if (!result.succeeded) return messageDefaultAction();

    if (flow.showRangeValueFlowStep === 0 && !state.isPreviousFlowStepCalled) {
      return new telegramTemplate.Text(rangeMessageTemplate(result.model.range))
        .addInlineKeyboard(rangeKeyboardTemplate)
        .get();
    }

    return {
      method: 'editMessageText',
      body: {
        chat_id: request.message.chat.id,
        message_id: request.message.message_id,
        text: rangeMessageTemplate(result.model.range),
        reply_markup: {
          inline_keyboard: rangeKeyboardTemplate,
        },
      },
    };
  }
  return null;
};

module.exports = showRangeValueFlowStep;
