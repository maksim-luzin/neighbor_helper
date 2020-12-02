const { telegramTemplate } = require('claudia-bot-builder');
const { chooseLocationKeyboardTemplate, chooseLocationMessageTemplate } = require('../../../templates/locationTemplate');
const { messageDefaultAction } = require('../../../actions/commonActions');

const { locationService } = require('../../../services');

const chooseAssignmentLocationFlowStep = async (request, state, flow) => {
  if (!state.data.chosenLocationId
    || (state.isLastFlowStepCalled
      && flow.indexOf(state.lastFlowStep) <= flow.indexOf(chooseAssignmentLocationFlowStep.name))) {
    const result = await locationService.getAllByTelegramId(request.from.id);
    if (!result.succeeded) return messageDefaultAction();

    if (flow.indexOf(chooseAssignmentLocationFlowStep.name) === 0 && !state.isLastFlowStepCalled) {
      return new telegramTemplate.Text(chooseLocationMessageTemplate)
        .addInlineKeyboard(chooseLocationKeyboardTemplate(result.model.map((elem) => ({
          callback_data: `chooseAssignmentLocationAction.${elem.id}`,
          text: elem.localName,
        }))))
        .get();
    }

    return {
      method: 'editMessageText',
      body: {
        chat_id: request.message.chat.id,
        message_id: request.message.message_id,
        text: chooseLocationMessageTemplate,
        reply_markup: {
          inline_keyboard: chooseLocationKeyboardTemplate(result.model.map((elem) => ({
            callback_data: `chooseAssignmentLocationAction.${elem.id}`,
            text: elem.localName,
          }))),
        },
      },
    };
  }
  return null;
};

module.exports = chooseAssignmentLocationFlowStep;
