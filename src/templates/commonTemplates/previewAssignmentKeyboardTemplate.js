const { COMMON_BUTTONS, ADD_ASSIGNMENT_BUTTONS } = require('../../constants/button.text');

const previewAssignmentKeyboardTemplate = [
  [COMMON_BUTTONS.EDIT_ASSIGNMENT],
  [ADD_ASSIGNMENT_BUTTONS.PUBLISH_ASSIGNMENT],
  [COMMON_BUTTONS.HOME, COMMON_BUTTONS.BACK],
];

module.exports = previewAssignmentKeyboardTemplate;
