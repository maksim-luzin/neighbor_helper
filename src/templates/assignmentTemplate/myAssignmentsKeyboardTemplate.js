const {
  BUTTON_FAVORITE_ASSIGNMENTS,
  BUTTON_CREATED_ASSIGNMENTS,
} = require('../../constants/button.text').MY_ASSIGNMENTS_MENU;
const { BUTTON_HOME } = require('../../constants/button.text').COMMON;

const myAssignmentsKeyboardTemplate = [
  [BUTTON_FAVORITE_ASSIGNMENTS],
  [BUTTON_CREATED_ASSIGNMENTS],
  [BUTTON_HOME],
];

module.exports = myAssignmentsKeyboardTemplate;
