const { telegramTemplate } = require('claudia-bot-builder');
const { aboutUsMessageTemplate } = require('../templates/aboutUsTemplate');
const { mainMenuKeyboardTemplate, mainMenuMessageTemplate } = require('../templates/mainMenuTemplate');
const {
  rangeKeyboardTemplate,
  rangeMessageTemplate,
  rangeResponseMessageTemplate,
} = require('../templates/rangeTemplate');
const { myAssignmentsKeyboardTemplate } = require('../templates/assignmentTemplate');
const { create, update } = require('../services').userService;
const {
  chooseCategoryKeyboardTemplate,
  chooseCategoryMessageTemplate,
} = require('../templates/categoryTemplates');

const {
  CHOOSE_CATEGORY,
  CHOOSE_LOCATION,
} = require('../constants/flow.step').FIND_ASSIGNMENTS;
const setState = require('../helpers/setState');

const {
  addLocationMessageTemplate,
  addLocationKeyboardTemplate,
} = require('../templates/locationTemplates');

const {
  ADD_LOCATION,
} = require('../constants/flow.step').ADD_LOCATION;

const {
  CHANGE_RANGE,
} = require('../constants/flow.step').CHANGE_RANGE;

const { userService } = require('../services');

const startAction = async (message) => {
  const result = await create(
    {
      telegramId: message.from.id,
    },
  );

  if (!result.succeeded) throw Error(result.message);

  const messageStart = `Здравствуй, ${message.from.first_name}.\n${aboutUsMessageTemplate}`;

  return new telegramTemplate.Text(messageStart)
    .addReplyKeyboard(
      mainMenuKeyboardTemplate,
      { one_time_keyboard: true },
    )
    .get();
};

const mainMenuAction = async (message) => {
  // eslint-disable-next-line no-use-before-define
  await setState(message.from.id);
  return (
    new telegramTemplate.Text(mainMenuMessageTemplate)
      .addReplyKeyboard(
        mainMenuKeyboardTemplate,
        { one_time_keyboard: true },
      )
      .get()
  );
};

const aboutUsAction = () => aboutUsMessageTemplate;

const showRangeAction = async (message, state) => {
  const result = await userService.getOne({ telegramId: message.from.id, params: ['range'] });

  if (!result.succeeded) throw Error(result.message);

  await setState(message.from.id, CHANGE_RANGE);

  return new telegramTemplate.Text(rangeMessageTemplate(result.model.range))
    .addReplyKeyboard(rangeKeyboardTemplate)
    .get();
};

const changeRangeAction = async (message, state) => {
  if (Math.sign(message.text) === 1 && message.text <= 1000) {
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
  .Text('Выберите фильтр').addReplyKeyboard(myAssignmentsKeyboardTemplate).get();

const addMenuAddLocationAction = async (message) => {
  // eslint-disable-next-line no-use-before-define
  await setState(message.from.id, ADD_LOCATION);
  return (
    new telegramTemplate.Text(addLocationMessageTemplate)
      .addReplyKeyboard(
        addLocationKeyboardTemplate,
        { one_time_keyboard: true },
      )
      .get()
  );
};

const findAssignmentsAction = async (message) => {
  await setState(message.from.id, CHOOSE_CATEGORY);
  return (
    new telegramTemplate.Text(chooseCategoryMessageTemplate)
      .addReplyKeyboard(
        chooseCategoryKeyboardTemplate,
      )
      .get()
  );
};

module.exports = {
  startAction,
  mainMenuAction,
  aboutUsAction,
  showRangeAction,
  changeRangeAction,
  myAssignmentAction,
  addMenuAddLocationAction,
  findAssignmentsAction,
};
