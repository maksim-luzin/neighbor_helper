const { telegramTemplate } = require('claudia-bot-builder');
const { chooseLocationKeyboardTemplate, chooseLocationMessageTemplate } = require('../../../templates/locationTemplate');
const { messageDefaultAction } = require('../../../actions/commonActions');

const { userService } = require('../../../services');
const { locationService } = require('../../../services');

const chooseAssignmentLocationFlowStep = async (request, state, flow) => {
  if (!state.data.chosenLocationId
    || (flow[state.currentFlowStep] - 1 === flow.chooseAssignmentLocationFlowStep
    && state.isPreviousFlowStepCalled)
    || flow[state.currentFlowStep] + 1 === flow.chooseAssignmentLocationFlowStep) {
    let result;

    result = await userService.update({
      telegramId: request.from.id,
      params: {
        state: {
          currentFlowStep: 'chooseAssignmentLocationFlowStep',
          isPreviousFlowStepCalled: false,
        },
      },
    });
    if (!result.succeeded) return messageDefaultAction();

    result = await locationService.getAllByTelegramId(request.from.id);
    if (!result.succeeded) return messageDefaultAction();

    if (flow.chooseAssignmentLocationFlowStep === 0 && !state.isPreviousFlowStepCalled) {
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
