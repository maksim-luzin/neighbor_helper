const {
  BUTTON_ADD_LOCATION,
  BUTTON_ABOUT_US,
  BUTTON_CHANGE_RANGE,
  BUTTON_MY_ASSIGNMENT,
} = require('../../constants/button.text').MAIN_MENU;

const mainMenuKeyboardTemplate = [
  [BUTTON_CHANGE_RANGE],
  [BUTTON_ADD_LOCATION],
  [BUTTON_MY_ASSIGNMENT],
  ['Подать объявление'],
  ['Найти объявление'],
  ['Язык', BUTTON_ABOUT_US],
];

module.exports = mainMenuKeyboardTemplate;
