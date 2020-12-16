const {
  BUTTON_HOME,
  BUTTON_BACK,
  BUTTON_SKIP,
} = require('../../constants/button.text').COMMON;

const skipCommonKeyboardTemplate = [
  [BUTTON_SKIP],
  [BUTTON_HOME, BUTTON_BACK],
];

module.exports = skipCommonKeyboardTemplate;
