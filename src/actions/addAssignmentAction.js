/* eslint-disable no-use-before-define */
const { telegramTemplate } = require('claudia-bot-builder');
const setState = require('../helpers/setState');
const { chooseCategoryKeyboardTemplate } = require('../templates/categoryTemplates');
const { create } = require('../services/assignment.service');
const { assignmentCategory } = require('../constants/enums');
const responseMessage = require('../helpers/responseMessage');

const {
  BUTTON_BACK,
  BUTTON_SKIP,
} = require('../constants/button.text').COMMON;

const {
  ADD_TITLE,
  ADD_DESCRIPTION,
  CHOOSE_LOCATION,
  ADD_REWARD,
  ADD_PICTURE,
  SHOW_ASSIGNMENT,
  PUBLISH_ASSIGNMENT,
} = require('../constants/flow.step').ADD_ASSIGNMENT;

const {
  commonKeyboardTemplate,
  skipCommonKeyboardTemplate,
} = require('../templates/commonTemplates');

const {
  previewAssignnmentMessageTemplate,
  previewAssignnmentKeyboardTemplate,
  publishAssignnmentMessageTemplate,
} = require('../templates/addAssignmentTemplates');

const {
  addTitleAssignmentMessageTemplate,
  addDescriptionAssignmentMessageTemplate,
  addRewardAssignmentMessageTemplate,
  addPictureAssignmentMessageTemplate,
  chooseLocationAssignmentMessageTemplate,
} = require('../templates/addAssignmentTemplates');

const addLocationNamesToKeyboard = require('../helpers/locationNamesKeyboard');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplate');

const chooseCategoryAssignmentAction = async (message, state) => {
  const { text } = message;
  if (!(text === BUTTON_BACK || validationInputCategory(text))) return;
  const category = text === BUTTON_BACK
    ? state.data.category
    : text;

  await setState(
    message.from.id,
    ADD_TITLE,
    {
      authorTelegramId: message.from.id,
      category,
    },
  );

  // eslint-disable-next-line consistent-return
  const response = commonKeyboard(addTitleAssignmentMessageTemplate, message);

  // eslint-disable-next-line consistent-return
  return response;
};

const addTitleForAddAssignmentAction = async (message, state) => {
  const { text } = message;

  const title = text === BUTTON_BACK
    ? state.data.title
    : text;

  await setState(
    message.from.id,
    ADD_DESCRIPTION,
    {
      ...state.data,
      title,
    },
  );

  // eslint-disable-next-line no-use-before-define
  return commonKeyboard(addDescriptionAssignmentMessageTemplate, message);
};

const addDescriptionForAddAssignmentAction = async (message, state) => {
  const locationKeyboardTemplate = await addLocationNamesToKeyboard(message.from.id);
  const { text } = message;
  const description = text === BUTTON_BACK
    ? state.data.description
    : text;

  await setState(
    message.from.id,
    CHOOSE_LOCATION,
    {
      ...state.data,
      description,
    },
    locationKeyboardTemplate.cache,
  );

  return responseMessage(
    message,
    chooseLocationAssignmentMessageTemplate,
    locationKeyboardTemplate.keyboard,
  );
};

const chooseLocationForAddAssignmentAction = async (message, state) => {
  const { text } = message;
  if (!(text === BUTTON_BACK || state.cache[message.text])) return;

  const localLocationName = text === BUTTON_BACK
    ? state.data.localLocationName
    : text;
  const cache = text === BUTTON_BACK
    ? state.cache
    : text;

  await setState(
    message.from.id,
    ADD_REWARD,
    {
      ...state.data,
      localLocationName,
    },
    cache,
  );

  // eslint-disable-next-line consistent-return
  return skipCommonKeyboard(addRewardAssignmentMessageTemplate, message);
};

const addRewardForAddAssignmentAction = async (message, state) => {
  const { text } = message;
  let data = { ...state.data };
  if (text !== BUTTON_BACK) data = { ...data, reward: text };
  if (text === BUTTON_SKIP && data.reward) delete data.reward;

  await setState(
    message.from.id,
    ADD_PICTURE,
    data,
    state.cache,
  );

  // eslint-disable-next-line no-use-before-define
  return skipCommonKeyboard(addPictureAssignmentMessageTemplate, message);
};

const addPictureForAddAssignmentAction = async (message, state) => {
  const data = { ...state.data };
  let pictureUrl;

  const photo = message.photo
    ? message.photo
    : false;

  const text = message.text
    ? message.text
    : false;

  if (photo) {
    const { length } = photo;
    pictureUrl = photo[length - 1].file_id;
  }
  if (text === BUTTON_SKIP && data.pictureUrl) delete data.pictureUrl;

  await setState(
    message.from.id,
    SHOW_ASSIGNMENT,
    data,
    state.cache,
  );
  let assignment = `*${state.data.title}*\n ${state.data.description}`;
  if (state.data.reward) assignment += `\n\`Награда: ${state.data.reward}\``;
  assignment += `\n\`Локация: ${state.cache}\``;

  if (photo) {
    return responseMessage(
      message,
      assignment,
      previewAssignnmentKeyboardTemplate,
      pictureUrl,
    );
  }

  return responseMessage(
    message,
    assignment,
    previewAssignnmentKeyboardTemplate,
  );
};

const publishAddAssignmentAction = async (message, state) => {
  await setState(message.from.id);
  const assignment = state.data;
  assignment.category = assignmentCategory[assignment.category];
  const result = await create(state.data);
  if (!result.succeeded) throw Error(result.message);
  return responseMessage(
    message,
    publishAssignnmentMessageTemplate,
    mainMenuKeyboardTemplate,
  );
};

module.exports = {
  chooseCategoryAssignmentAction,
  addTitleForAddAssignmentAction,
  addDescriptionForAddAssignmentAction,
  addRewardForAddAssignmentAction,
  chooseLocationForAddAssignmentAction,
  addPictureForAddAssignmentAction,
  publishAddAssignmentAction,
};

function validationInputCategory(text) {
  const { length } = chooseCategoryKeyboardTemplate;
  const response = chooseCategoryKeyboardTemplate.some((row, rowKey) => (
    rowKey < (length - 1) && row.some((cell) => cell === text)
  ));
  return response;
}

function commonKeyboard(resMessage, message) {
  return responseMessage(
    message,
    resMessage,
    commonKeyboardTemplate,
  );
}

function skipCommonKeyboard(resMessage, message) {
  return responseMessage(
    message,
    resMessage,
    skipCommonKeyboardTemplate,
  );
}
