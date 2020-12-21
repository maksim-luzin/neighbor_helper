const sequelize = require('../database/connection/localConnection');
const { setState } = require('../helpers/state');
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
  SHOW_ASSIGNMENT,
  PUBLISH_ASSIGNMENT,
} = require('../constants/flow.step').ADD_ASSIGNMENT;

const {
  addTitleAssignmentMessageTemplate,
  addDescriptionAssignmentMessageTemplate,
  addRewardAssignmentMessageTemplate,
  addPictureAssignmentMessageTemplate,
  chooseLocationAssignmentMessageTemplate,
} = require('../templates/addAssignmentTemplates');

const addLocationNamesToKeyboard = require('../helpers/locationNamesKeyboard');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplate');

const {
  commonKeyboard,
  skipCommonKeyboard,
} = require('../helpers/commonKeyboards');

const validationInputCategory = require('../helpers/validationInputCategory');

const {
  previewAssignnmentMessageTemplate,
  previewAssignnmentKeyboardTemplate,
  publishNewAssignnmentMessageTemplate,
} = require('../templates/commonTemplates');

const chooseCategoryAssignmentAction = async (message, state, categoryHandler) => {
  const { text } = message;
  // eslint-disable-next-line no-use-before-define
  if (!categoryHandler && !(text === BUTTON_BACK || validationInputCategory(text))) return;
  // eslint-disable-next-line no-nested-ternary
  const category = text === BUTTON_BACK
    ? state.data.category
    : categoryHandler
      ? text
      : assignmentCategory[text];

  await setState(
    message.from.id,
    ADD_TITLE,
    {
      authorTelegramId: message.from.id,
      category,
    },
  );
  const assignment = {
    ...message.data,
    category,
  };
  // eslint-disable-next-line consistent-return
  return commonKeyboard(
    addTitleAssignmentMessageTemplate,
    message,
    assignment,
    2,
  );
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

  const assignment = {
    ...state.data,
    title,
  };
  // eslint-disable-next-line no-use-before-define
  return commonKeyboard(
    addDescriptionAssignmentMessageTemplate,
    message,
    assignment,
  );
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

  const assignment = {
    ...state.data,
    description,
  };
  return responseMessage(
    message,
    chooseLocationAssignmentMessageTemplate,
    locationKeyboardTemplate.keyboard,
    null,
    assignment,
    3,
  );
};

const chooseLocationForAddAssignmentAction = async (message, state) => {
  const { text } = message;
  const { data } = state;
  if (!(text === BUTTON_BACK || state.cache[message.text])) return;

  const localLocationName = text === BUTTON_BACK
    ? data.localLocationName
    : text;

  await setState(
    message.from.id,
    ADD_REWARD,
    {
      ...data,
      localLocationName,
    },
  );

  const assignment = {
    ...data,
    localLocationName,
  };
  // eslint-disable-next-line consistent-return
  return skipCommonKeyboard(
    addRewardAssignmentMessageTemplate,
    message,
    assignment,
  );
};

const addRewardForAddAssignmentAction = async (message, state) => {
  const { text } = message;
  let { data } = state;
  if (text !== BUTTON_BACK) data = { ...data, reward: text };
  if (text === BUTTON_SKIP && data.reward) delete data.reward;

  await setState(
    message.from.id,
    SHOW_ASSIGNMENT,
    data,
  );

  // eslint-disable-next-line no-use-before-define
  return skipCommonKeyboard(
    addPictureAssignmentMessageTemplate,
    message,
    data,
  );
};

const addPictureForAddAssignmentAction = async (message, state) => {
  let { data } = state;
  let pictureUrl = null;

  const photo = message.photo
    ? message.photo
    : false;

  const text = message.text
    ? message.text
    : false;

  if (photo) {
    const { length } = photo;
    pictureUrl = photo[length - 1].file_id;
    data = { ...data, pictureUrl };
  }
  if (text === BUTTON_SKIP && data.pictureUrl) delete data.pictureUrl;

  await setState(
    message.from.id,
    PUBLISH_ASSIGNMENT,
    data,
  );

  return responseMessage(
    message,
    previewAssignnmentMessageTemplate,
    previewAssignnmentKeyboardTemplate,
    null,
    data,
    3,
  );
};

const publishAddAssignmentAction = async (message, state) => {
  const transaction = await sequelize.transaction();
  try {
    const result = await create(state.data, transaction);
    if (!result.succeeded) throw Error(result.message);
    await setState(message.from.id, null, null, null, transaction);
    await transaction.commit();
  } catch {
    await transaction.rollback();
  }
  const result = await create(state.data);
  if (!result.succeeded) throw Error(result.message);
  await setState(message.from.id);
  return responseMessage(
    message,
    publishNewAssignnmentMessageTemplate,
    mainMenuKeyboardTemplate,
    null,
    null,
    3,
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
