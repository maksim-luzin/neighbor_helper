const { telegramTemplate } = require('claudia-bot-builder');
const { MAX_AVAILABLE_RANGE } = require('../configs/global.config');

const {
  ADD_ASSIGNMENT_FLOW_STEPS,
  FIND_ASSIGNMENTS_FLOW_STEPS,
  CHANGE_RANGE_FLOW_STEPS,
} = require('../constants/flow.step');

const { aboutUsMessageTemplate } = require('../templates/aboutUsTemplates');

const {
  mainMenuKeyboardTemplate,
  mainMenuMessageTemplate,
  greetingsMessageTemplate,
} = require('../templates/mainMenuTemplates');

const {
  rangeKeyboardTemplate,
  rangeMessageTemplate,
  rangeResponseMessageTemplate,
} = require('../templates/rangeTemplates');

const {
  myAssignmentsKeyboardTemplate,
  chooseFilterMessageTemplate,
} = require('../templates/assignmentTemplates');

const {
  chooseCategoryKeyboardTemplate,
  chooseCategoryMessageTemplate,
} = require('../templates/categoryTemplates');

const {
  changeLanguageMessageTemplate,
  changeLanguageKeyboardTemplate,
} = require('../templates/changeLanguageTemplates');

const responseMessage = require('../helpers/responseMessage');

const { setState } = require('../helpers/state');
const { userService } = require('../services');

const startAction = async (message) => {
  const result = await userService.create(
    {
      telegramId: message.from.id,
    },
  );

  if (!result.succeeded) throw Error(result.message);

  const messageStart = `${greetingsMessageTemplate(message.from.first_name)}\n${aboutUsMessageTemplate}`;

  return responseMessage(
    message,
    messageStart,
    mainMenuKeyboardTemplate,
  );
};

const mainMenuAction = async (message) => {
  // eslint-disable-next-line no-use-before-define
  await setState(message.from.id);
  return responseMessage(
    message,
    mainMenuMessageTemplate,
    mainMenuKeyboardTemplate,
  );
};

const aboutUsAction = (message) => responseMessage(
  message,
  aboutUsMessageTemplate,
  mainMenuKeyboardTemplate,
);

const showRangeAction = async (message) => {
  const result = await userService.getOne({ telegramId: message.from.id, params: ['range'] });

  if (!result.succeeded) throw Error(result.message);

  await setState(message.from.id, CHANGE_RANGE_FLOW_STEPS.CHANGE_RANGE);

  return new telegramTemplate.Text(rangeMessageTemplate(result.model.range))
    .addReplyKeyboard(rangeKeyboardTemplate)
    .get();
};

const changeRangeAction = async (message) => {
  if (Math.sign(message.text) === 1 && message.text <= MAX_AVAILABLE_RANGE) {
    const result = await userService.update({
      telegramId: message.from.id,
      newRange: message.text,
    });

    if (!result.succeeded) throw Error(result.message);

    return new telegramTemplate
      .Text(rangeResponseMessageTemplate.rangeSuccessResponseMessageTemplate)
      .addReplyKeyboard(
        mainMenuKeyboardTemplate,
        { one_time_keyboard: true },
      )
      .get();
  }
  return new telegramTemplate
    .Text(rangeResponseMessageTemplate.rangeErrorResponseMessageTemplate)
    .get();
};

const myAssignmentAction = () => new telegramTemplate
  .Text(chooseFilterMessageTemplate).addReplyKeyboard(myAssignmentsKeyboardTemplate).get();

const chooseLanguageAction = () => new telegramTemplate
  .Text(changeLanguageMessageTemplate).addReplyKeyboard(changeLanguageKeyboardTemplate).get();

const findAssignmentsAction = async (message) => {
  await setState(message.from.id, FIND_ASSIGNMENTS_FLOW_STEPS.CHOOSE_CATEGORY);
  return (
    new telegramTemplate.Text(chooseCategoryMessageTemplate)
      .addReplyKeyboard(
        chooseCategoryKeyboardTemplate,
      )
      .get()
  );
};

const addMenuSelectCategoryForCreatedAssignmentAction = async (message) => {
  await setState(message.from.id, ADD_ASSIGNMENT_FLOW_STEPS.CHOOSE_CATEGORY);
  return responseMessage(
    message,
    chooseCategoryMessageTemplate,
    chooseCategoryKeyboardTemplate,
  );
};

module.exports = {
  startAction,
  mainMenuAction,
  aboutUsAction,
  showRangeAction,
  changeRangeAction,
  myAssignmentAction,
  chooseLanguageAction,
  findAssignmentsAction,
  addMenuSelectCategoryForCreatedAssignmentAction,
};
