const { COMMON_BUTTONS } = require('../constants/button.text');

const { EDIT_ASSIGNMENT_FLOW_STEPS } = require('../constants/flow.step');

const {
  editTitleAssignmentMessageTemplate,
  editDescriptionAssignmentMessageTemplate,
  editRewardAssignmentMessageTemplate,
  editPictureAssignmentMessageTemplate,
  chooseLocationAssignmentForEditMessageTemplate,
  chooseCategoryMessageTemplate,
} = require('../templates/editAssignmentTemplates');

const {
  previewAssignmentMessageTemplate,
  previewAssignmentKeyboardTemplate,
  publishNewAssignmentMessageTemplate,
  publishUpdateAssignmentMessageTemplate,
} = require('../templates/commonTemplates');

const responseMessage = require('../helpers/responseMessage');

const { chooseCategoryKeyboardTemplate } = require('../templates/categoryTemplates');

const addLocationNamesToKeyboard = require('../helpers/locationNamesKeyboard');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplates');

const {
  skipCommonKeyboard,
  skipDeleteCommonKeyboard,
} = require('../helpers/commonKeyboards');

const { setState } = require('../helpers/state');
const { assignmentService } = require('../services');
const { assignmentCategory } = require('../constants/enums');

const validationInputCategory = require('../helpers/validationInputCategory');

const addMenuSelectCategoryForEditAssignmentAction = async (message, state = null, id = null) => {
  let userId = message.from.id;
  let data;
  if (state) data = state.data;
  if (id) {
    data = await assignmentService.assignmentGetById(id);
    data = data.toJSON();
    data = {
      ...data,
      localLocationName: data.Location.localName,
    };
    delete data.Location;
    userId = data.authorTelegramId;
  }

  const numberMessageForDelete = state
    ? 3
    : 1;
  await setState(
    userId,
    EDIT_ASSIGNMENT_FLOW_STEPS.CHOOSE_CATEGORY,
    data,
  );

  return responseMessage(
    message,
    chooseCategoryMessageTemplate,
    chooseCategoryKeyboardTemplate,
    null,
    data,
    numberMessageForDelete,
  );
};

const chooseCategoryForEditAssignmentAction = async (message, state, categoryHandler) => {
  const { text } = message;
  const { data } = state;

  // eslint-disable-next-line no-use-before-define
  if (!categoryHandler && !(text === COMMON_BUTTONS.BACK || validationInputCategory(text))) return;
  // eslint-disable-next-line no-nested-ternary
  const category = text === COMMON_BUTTONS.BACK || text === COMMON_BUTTONS.SKIP
    ? data.category
    : categoryHandler
      ? text
      : assignmentCategory[text];

  await setState(
    message.from.id,
    EDIT_ASSIGNMENT_FLOW_STEPS.EDIT_TITLE,
    {
      ...data,
      category,
    },
  );
  const assignment = {
    ...data,
    category,
  };
  // eslint-disable-next-line consistent-return
  return skipCommonKeyboard(
    editTitleAssignmentMessageTemplate,
    message,
    assignment,
  );
};

const editTitleForEditAssignmentAction = async (message, state) => {
  const { text } = message;
  const { data } = state;

  const title = text === COMMON_BUTTONS.BACK || text === COMMON_BUTTONS.SKIP
    ? data.title
    : text;

  await setState(
    message.from.id,
    EDIT_ASSIGNMENT_FLOW_STEPS.EDIT_DESCRIPTION,
    {
      ...data,
      title,
    },
  );

  const assignment = {
    ...data,
    title,
  };
  // eslint-disable-next-line no-use-before-define
  return skipCommonKeyboard(
    editDescriptionAssignmentMessageTemplate,
    message,
    assignment,
  );
};

const editDescriptionForEditAssignmentAction = async (message, state) => {
  const locationKeyboardTemplate = await addLocationNamesToKeyboard(message.from.id);
  const { text } = message;
  const { data } = state;
  const description = text === COMMON_BUTTONS.BACK || text === COMMON_BUTTONS.SKIP
    ? data.description
    : text;

  await setState(
    message.from.id,
    EDIT_ASSIGNMENT_FLOW_STEPS.CHOOSE_LOCATION,
    {
      ...data,
      description,
    },
    {
      locationKeyboardTemplate: locationKeyboardTemplate.cache,
    },
  );

  const assignment = {
    ...data,
    description,
  };

  return responseMessage(
    message,
    chooseLocationAssignmentForEditMessageTemplate,
    locationKeyboardTemplate.keyboard,
    null,
    assignment,
    state.cache.deleteMessage || 3,
  );
};

const chooseLocationForEditAssignmentAction = async (message, state) => {
  const { text } = message;
  const { data } = state;
  if (!(text === COMMON_BUTTONS.BACK || state.cache.locationKeyboardTemplate[message.text])) return;

  const localLocationName = text === COMMON_BUTTONS.BACK || text === COMMON_BUTTONS.SKIP
    ? state.data.localLocationName
    : text;

  await setState(
    message.from.id,
    EDIT_ASSIGNMENT_FLOW_STEPS.EDIT_REWARD,
    {
      ...state.data,
      localLocationName,
    },
  );

  const assignment = {
    ...data,
    localLocationName,
  };
  // eslint-disable-next-line consistent-return
  if (data.reward) {
    // eslint-disable-next-line consistent-return
    return skipDeleteCommonKeyboard(
      editRewardAssignmentMessageTemplate,
      message,
      assignment,
    );
  }

  // eslint-disable-next-line consistent-return
  return skipCommonKeyboard(
    editRewardAssignmentMessageTemplate,
    message,
    assignment,
  );
};

const editRewardForEditAssignmentAction = async (message, state) => {
  const { text } = message;
  let { data } = state;

  if (text !== COMMON_BUTTONS.BACK && text !== COMMON_BUTTONS.SKIP) {
    data = {
      ...data,
      reward: text,
    };
  }

  if (text === COMMON_BUTTONS.DELETE) delete data.reward;
  await setState(
    message.from.id,
    EDIT_ASSIGNMENT_FLOW_STEPS.SHOW_ASSIGNMENT,
    data,
  );
  const assignment = {
    ...data,
  };

  // eslint-disable-next-line no-use-before-define
  if (data.pictureUrl) {
    return skipDeleteCommonKeyboard(
      editPictureAssignmentMessageTemplate,
      message,
      assignment,
    );
  }

  return skipCommonKeyboard(
    editPictureAssignmentMessageTemplate,
    message,
    assignment,
  );
};

const editPictureForEditAssignmentAction = async (message, state) => {
  let { data } = state;
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
    data = { ...data, pictureUrl };
  }
  if (text === COMMON_BUTTONS.DELETE) delete data.pictureUrl;

  await setState(
    message.from.id,
    EDIT_ASSIGNMENT_FLOW_STEPS.PUBLISH_ASSIGNMENT,
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

const publishEditAssignmentAction = async (message, state) => {
  const { data } = state;
  let result;
  let messageTemplate;

  if (!data.id) {
    result = await assignmentService.create(state.data);
    messageTemplate = publishNewAssignmentMessageTemplate;
  } else {
    const { id, ...dataUpdate } = data;
    result = await assignmentService.assignmentUpdateById(id, dataUpdate);
    messageTemplate = publishUpdateAssignmentMessageTemplate;
  }
  if (!result.succeeded) throw Error(result.message);
  await setState(message.from.id, null, null, null);

  return responseMessage(
    message,
    messageTemplate,
    mainMenuKeyboardTemplate,
    null,
    null,
    3,
  );
};

module.exports = {
  addMenuSelectCategoryForEditAssignmentAction,
  chooseCategoryForEditAssignmentAction,
  editTitleForEditAssignmentAction,
  editDescriptionForEditAssignmentAction,
  editRewardForEditAssignmentAction,
  chooseLocationForEditAssignmentAction,
  editPictureForEditAssignmentAction,
  publishEditAssignmentAction,
};
