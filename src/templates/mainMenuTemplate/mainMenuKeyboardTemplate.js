const {
  BUTTON_ADD_LOCATION,
  BUTTON_ABOUT_US,
  BUTTON_CHANGE_RANGE,
  BUTTON_MY_ASSIGNMENT,
  BUTTON_FIND_ASSIGNMENTS,
} = require('../../constants/button.text').MAIN_MENU;

const mainMenuKeyboardTemplate = [
  [BUTTON_CHANGE_RANGE],
  [BUTTON_ADD_LOCATION],
  [BUTTON_MY_ASSIGNMENT],
  ['Подать объявление'],
  [BUTTON_FIND_ASSIGNMENTS],
  ['Язык', BUTTON_ABOUT_US],
];

module.exports = mainMenuKeyboardTemplate;
