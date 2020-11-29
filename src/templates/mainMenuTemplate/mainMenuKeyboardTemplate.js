const {
  BUTTON_ADD_LOCATION,
  BUTTON_ABOUT_US,
} = require('../../constants/button.text').MAIN_MENU;

const mainMenuKeyboardTemplate = [
  ['Редактировать радиус'],
  [BUTTON_ADD_LOCATION],
  ['Мои объявления'],
  ['Подать объявление'],
  ['Найти объявление'],
  ['Язык', BUTTON_ABOUT_US],
];

module.exports = mainMenuKeyboardTemplate;
