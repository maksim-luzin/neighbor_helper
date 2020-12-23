const {
  BUTTON_HOME,
  BUTTON_BACK,
  EDIT_ASSIGNMENT,
} = require('../../constants/button.text').COMMON;

const {
  PUBLISH_ASSIGNMENT,
} = require('../../constants/button.text').ADD_ASSIGNMENT;

const previewAssignmentKeyboardTemplate = [
  [EDIT_ASSIGNMENT],
  [PUBLISH_ASSIGNMENT],
  [BUTTON_HOME, BUTTON_BACK],
];

module.exports = previewAssignmentKeyboardTemplate;
