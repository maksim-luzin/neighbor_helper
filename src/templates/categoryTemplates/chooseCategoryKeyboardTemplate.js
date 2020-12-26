const {
  CATEGORY_BUTTONS,
  COMMON_BUTTONS,
} = require('../../constants/button.text');

const chooseCategoryKeyboardTemplate = [
  [CATEGORY_BUTTONS.REPAIR],
  [CATEGORY_BUTTONS.EDUCATION],
  [CATEGORY_BUTTONS.HELP],
  [CATEGORY_BUTTONS.BARTER],
  [CATEGORY_BUTTONS.OTHER],
  [COMMON_BUTTONS.HOME],
];

module.exports = chooseCategoryKeyboardTemplate;
