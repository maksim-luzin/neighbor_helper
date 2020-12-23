const {
  BUTTON_HOME,
  BUTTON_BACK,
  BUTTON_SKIP,
  BUTTON_DELETE,
} = require('../../constants/button.text').COMMON;

const skipDeleteCommonKeyboardTemplate = [
  [BUTTON_DELETE, BUTTON_SKIP],
  [BUTTON_HOME, BUTTON_BACK],
];

module.exports = skipDeleteCommonKeyboardTemplate;
