const { setState } = require('../helpers/state');
const { create } = require('../services/assignment.service');
const { assignmentCategory } = require('../constants/enums');
const responseMessage = require('../helpers/responseMessage');

const { COMMON_BUTTONS } = require('../constants/button.text');
const { ADD_ASSIGNMENT_FLOW_STEPS } = require('../constants/flow.step');

const {
  addTitleAssignmentMessageTemplate,
  addDescriptionAssignmentMessageTemplate,
  addRewardAssignmentMessageTemplate,
  addPictureAssignmentMessageTemplate,
  chooseLocationAssignmentMessageTemplate,
} = require('../templates/addAssignmentTemplates');

const addLocationNamesToKeyboard = require('../helpers/locationNamesKeyboard');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplates');

const {
  commonKeyboard,
  skipCommonKeyboard,
} = require('../helpers/commonKeyboards');

const validationInputCategory = require('../helpers/validationInputCategory');

const {
  previewAssignmentMessageTemplate,
  previewAssignmentKeyboardTemplate,
  publishNewAssignmentMessageTemplate,
} = require('../templates/commonTemplates');

const chooseCategoryAssignmentAction = async (message, state, categoryHandler) => {
  const { text } = message;
  // eslint-disable-next-line no-use-before-define
  if (!categoryHandler && !(text === COMMON_BUTTONS.BACK || validationInputCategory(text))) return;
  // eslint-disable-next-line no-nested-ternary
  const category = text === COMMON_BUTTONS.BACK
    ? state.data.category
    : categoryHandler
      ? text
      : assignmentCategory[text];

  await setState(
    message.from.id,
    ADD_ASSIGNMENT_FLOW_STEPS.ADD_TITLE,
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

  const title = text === COMMON_BUTTONS.BACK
    ? state.data.title
    : text;

  await setState(
    message.from.id,
    ADD_ASSIGNMENT_FLOW_STEPS.ADD_DESCRIPTION,
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
  const description = text === COMMON_BUTTONS.BACK
    ? state.data.description
    : text;

  await setState(
    message.from.id,
    ADD_ASSIGNMENT_FLOW_STEPS.CHOOSE_LOCATION,
    {
      ...state.data,
      description,
    },
    {
      locationKeyboardTemplate: locationKeyboardTemplate.cache,
    },
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
    state.cache.deleteMessage || 3,
  );
};

const chooseLocationForAddAssignmentAction = async (message, state) => {
  const { text } = message;
  const { data } = state;
  if (!(text === COMMON_BUTTONS.BACK || state.cache.locationKeyboardTemplate[message.text])) return;

  const localLocationName = text === COMMON_BUTTONS.BACK
    ? data.localLocationName
    : text;

  await setState(
    message.from.id,
    ADD_ASSIGNMENT_FLOW_STEPS.ADD_REWARD,
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
  if (text !== COMMON_BUTTONS.BACK) data = { ...data, reward: text };
  if (text === COMMON_BUTTONS.SKIP && data.reward) delete data.reward;

  await setState(
    message.from.id,
    ADD_ASSIGNMENT_FLOW_STEPS.SHOW_ASSIGNMENT,
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
  if (text === COMMON_BUTTONS.SKIP && data.pictureUrl) delete data.pictureUrl;

  await setState(
    message.from.id,
    ADD_ASSIGNMENT_FLOW_STEPS.PUBLISH_ASSIGNMENT,
    data,
  );

  return responseMessage(
    message,
    previewAssignmentMessageTemplate,
    previewAssignmentKeyboardTemplate,
    null,
    data,
    3,
  );
};

const publishAddAssignmentAction = async (message, state) => {
  const result = await create(state.data);
  if (!result.succeeded) throw Error(result.message);
  await setState(message.from.id);

  return responseMessage(
    message,
    publishNewAssignmentMessageTemplate,
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
