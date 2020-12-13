const { telegramTemplate } = require('claudia-bot-builder');
const { aboutUsMessageTemplate } = require('../templates/aboutUsTemplate');
const { mainMenuKeyboardTemplate, mainMenuMessageTemplate } = require('../templates/mainMenuTemplate');
const { rangeKeyboardTemplate, rangeMessageTemplate } = require('../templates/rangeTemplate');
const { myAssignmentsKeyboardTemplate } = require('../templates/assignmentTemplate');
const { create, update } = require('../services').userService;
const responseMessage = require('../helpers/responseMessage');
const {
  chooseCategoryKeyboardTemplate,
  chooseCategoryMessageTemplate,
} = require('../templates/categoryTemplates');

const {
  CHOOSE_CATEGORY,
  CHOOSE_LOCATION,
} = require('../constants/flow.step').FIND_ASSIGNMENTS;

const { ADD_ASSIGNMENT } = require('../constants/flow.step');
const setState = require('../helpers/setState');

const {
  addLocationMessageTemplate,
  addLocationKeyboardTemplate,
} = require('../templates/locationTemplates');

const {
  ADD_LOCATION,
} = require('../constants/flow.step').ADD_LOCATION;

const { userService } = require('../services');

const startAction = async (message) => {
  const result = await create(
    {
      telegramId: message.from.id,
    },
  );

  if (!result.succeeded) throw Error(result.message);

  const messageStart = `Здравствуй, ${message.from.first_name}.\n${aboutUsMessageTemplate}`;

  return [
    {
      method: 'deleteMessage',
      body: {
        message_id: message.message_id,
      },
    },
    new telegramTemplate
      .Text(messageStart)
      .addReplyKeyboard(
        mainMenuKeyboardTemplate,
        { one_time_keyboard: true },
      )
      // eslint-disable-next-line comma-dangle
      .get()
  ];
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

  return new telegramTemplate.Text(rangeMessageTemplate(result.model.range))
    .addInlineKeyboard(rangeKeyboardTemplate)
    .get();
};

const changeRangeAction = async (callbackQuery) => {
  let result = await userService.getOne({
    telegramId: callbackQuery.from.id,
    params: ['range'],
  });

  if (!result.succeeded) throw Error(result.message);

  let newRange = result.model.range;
  if (callbackQuery.data.split('.')[1] === '+') { // см. пояснение
    newRange = result.model.range + 1; // в src/templates/rangeTemplate/rangeKeyboardTemplate.js
  } else if (result.model.range > 1) {
    newRange = result.model.range - 1;
  }

  if (newRange === result.model.range) {
    return null;
  }

  result = await userService.update({
    telegramId: callbackQuery.from.id,
    newRange,
  });

  if (!result.succeeded) throw Error(result.message);

  return {
    method: 'editMessageText',
    body: {
      chat_id: callbackQuery.message.chat.id,
      message_id: callbackQuery.message.message_id,
      text: rangeMessageTemplate(newRange),
      reply_markup: {
        inline_keyboard: rangeKeyboardTemplate,
      },
    },
  };
};

const myAssignmentAction = () => new telegramTemplate
  .Text('Выберите фильтр').addReplyKeyboard(myAssignmentsKeyboardTemplate).get();

const addMenuAddLocationAction = async (message) => {
  // eslint-disable-next-line no-use-before-define
  await setState(message.from.id, ADD_LOCATION);
  return responseMessage(
    message,
    addLocationMessageTemplate,
    addLocationKeyboardTemplate,
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
const addMenuSelectCategoryForCreatedAssignmentAction = async (message) => {
  await setState(message.from.id, ADD_ASSIGNMENT.CHOOSE_CATEGORY);
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
  addMenuAddLocationAction,
  findAssignmentsAction,
  addMenuSelectCategoryForCreatedAssignmentAction,
};
