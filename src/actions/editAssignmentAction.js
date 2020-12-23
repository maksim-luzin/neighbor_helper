const { setState } = require('../helpers/state');
const {
  create,
  assignmentGetById,
  assignmentUpdateById,
} = require('../services').assignmentService;
const { assignmentCategory } = require('../constants/enums');
const responseMessage = require('../helpers/responseMessage');

const {
  BUTTON_BACK,
  BUTTON_SKIP,
  BUTTON_DELETE,
} = require('../constants/button.text').COMMON;

const {
  CHOOSE_CATEGORY,
  EDIT_TITLE,
  EDIT_DESCRIPTION,
  CHOOSE_LOCATION,
  EDIT_REWARD,
  SHOW_ASSIGNMENT,
  PUBLISH_ASSIGNMENT,
} = require('../constants/flow.step').EDIT_ASSIGNMENT;

const {
  editTitleAssignmentMessageTemplate,
  editDescriptionAssignmentMessageTemplate,
  editRewardAssignmentMessageTemplate,
  editPictureAssignmentMessageTemplate,
  chooseLocationAssignmentForEditMessageTemplate,
  chooseCategoryMessageTemplate,
} = require('../templates/editAssignmentTemplates');

const {
  previewAssignnmentMessageTemplate,
  previewAssignnmentKeyboardTemplate,
  publishNewAssignnmentMessageTemplate,
  publishUpdateAssignnmentMessageTemplate,
} = require('../templates/commonTemplates');

const { chooseCategoryKeyboardTemplate } = require('../templates/categoryTemplates');

const addLocationNamesToKeyboard = require('../helpers/locationNamesKeyboard');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplate');

const {
  skipCommonKeyboard,
  skipDeleteCommonKeyboard,
} = require('../helpers/commonKeyboards');

const validationInputCategory = require('../helpers/validationInputCategory');

const addMenuSelectCategoryForEditAssignmentAction = async (message, state = null, id = null) => {
  let userId = message.from.id;
  let data;
  if (state) data = state.data;
  if (id) {
    data = await assignmentGetById(id);
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
    CHOOSE_CATEGORY,
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
  if (!categoryHandler && !(text === BUTTON_BACK || validationInputCategory(text))) return;
  // eslint-disable-next-line no-nested-ternary
  const category = text === BUTTON_BACK || text === BUTTON_SKIP
    ? data.category
    : categoryHandler
      ? text
      : assignmentCategory[text];

  await setState(
    message.from.id,
    EDIT_TITLE,
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

  const title = text === BUTTON_BACK || text === BUTTON_SKIP
    ? data.title
    : text;

  await setState(
    message.from.id,
    EDIT_DESCRIPTION,
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
  const description = text === BUTTON_BACK || text === BUTTON_SKIP
    ? data.description
    : text;

  await setState(
    message.from.id,
    CHOOSE_LOCATION,
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
    3,
  );
};

const chooseLocationForEditAssignmentAction = async (message, state) => {
  const { text } = message;
  const { data } = state;
  if (!(text === BUTTON_BACK || state.cache.locationKeyboardTemplate[message.text])) return;

  const localLocationName = text === BUTTON_BACK || text === BUTTON_SKIP
    ? state.data.localLocationName
    : text;

  await setState(
    message.from.id,
    EDIT_REWARD,
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
  const { cache } = state;

  if (text !== BUTTON_BACK && text !== BUTTON_SKIP) data = { ...data, reward: text };
  if (text === BUTTON_DELETE) delete data.reward;
  await setState(
    message.from.id,
    SHOW_ASSIGNMENT,
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
  if (text === BUTTON_DELETE) delete data.pictureUrl;

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

const publishEditAssignmentAction = async (message, state) => {
  const { data } = state;
  let result;
  let messageTemplate;

  if (!data.id) {
    result = await create(state.data, transaction);
    messageTemplate = publishNewAssignnmentMessageTemplate;
  } else {
    const { id, ...dataUpdate } = data;
    result = await assignmentUpdateById(id, dataUpdate, transaction);
    messageTemplate = publishUpdateAssignnmentMessageTemplate;
  }
  if (!result.succeeded) throw Error(result.message);
  await setState(message.from.id, null, null, null, transaction);

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
