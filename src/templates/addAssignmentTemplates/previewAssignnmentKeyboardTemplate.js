const {
  BUTTON_HOME,
  BUTTON_BACK,
} = require('../../constants/button.text').COMMON;

const {
  PUBLISH_ASSIGNMENT,
} = require('../../constants/button.text').ADD_ASSIGNMENT;

const previewAssignnmentKeyboardTemplate = [
  [PUBLISH_ASSIGNMENT],
  [BUTTON_HOME, BUTTON_BACK],
];

module.exports = previewAssignnmentKeyboardTemplate;
