const { telegramTemplate } = require('claudia-bot-builder');
const { rangeKeyboardTemplate, rangeMessageTemplate } = require('../../../templates/rangeTemplate');
const { messageDefaultAction } = require('../../../actions/commonActions');

const { userService } = require('../../../services');

const changeRangeValueFlowStep = async (request, flow, state) => {
  let result;

  result = await userService.getOne({
    telegramId: request.from.id,
    params: ['range', 'state'],
  });

  if (!result.succeeded) return messageDefaultAction();

  let newRange = result.model.range;
  if (result.model.state.data.chosenRangeResult === '+') {
    newRange = result.model.range + 1;
  } else if (result.model.range > 1) {
    newRange = result.model.range - 1;
  }

  if (newRange === result.model.range) {
    return null;
  }

  result = await userService.update({
    telegramId: request.from.id,
    params: {
      state: {
        currentFlowStep: 'changeRangeValueFlowStep',
        isPreviousFlowStepCalled: false,
      },
      range: newRange,
    },
  });

  if (!result.succeeded) return messageDefaultAction();

  if (flow.changeRangeValueFlowStep === 0 && !state.isPreviousFlowStepCalled) {
    return new telegramTemplate.Text(rangeMessageTemplate(newRange))
      .addInlineKeyboard(rangeKeyboardTemplate)
      .get();
  }

  return {
    method: 'editMessageText',
    body: {
      chat_id: request.message.chat.id,
      message_id: request.message.message_id,
      text: rangeMessageTemplate(newRange),
      reply_markup: {
        inline_keyboard: rangeKeyboardTemplate,
      },
    },
  };
};

module.exports = changeRangeValueFlowStep;
