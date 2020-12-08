const {
  BUTTON_BARTER,
  BUTTON_EDUCATION,
  BUTTON_HELP,
  BUTTON_REPAIR,
  BUTTON_OTHER,
} = require('../../constants/button.text').CATEGORY;

const {
  BUTTON_HOME,
} = require('../../constants/button.text').COMMON;

const chooseCategoryKeyboardTemplate = [
  [BUTTON_REPAIR],
  [BUTTON_EDUCATION],
  [BUTTON_HELP],
  [BUTTON_BARTER],
  [BUTTON_OTHER],
  [BUTTON_HOME],
];

module.exports = chooseCategoryKeyboardTemplate;
