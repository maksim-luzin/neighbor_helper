const {
  BUTTON_ABOUT_US,
  BUTTON_CHANGE_RANGE,
  BUTTON_MY_ASSIGNMENT,
  BUTTON_FIND_ASSIGNMENTS,
  BUTTON_ADD_ASSIGNMENT,
} = require('../../constants/button.text').MAIN_MENU;

const { BUTTON_ADD_LOCATION } = require('../../constants/button.text').COMMON;

const mainMenuKeyboardTemplate = [
  [BUTTON_CHANGE_RANGE],
  [BUTTON_ADD_LOCATION],
  [BUTTON_MY_ASSIGNMENT],
  [BUTTON_FIND_ASSIGNMENTS],
  [BUTTON_ADD_ASSIGNMENT],
  ['Язык', BUTTON_ABOUT_US],
];

module.exports = mainMenuKeyboardTemplate;
