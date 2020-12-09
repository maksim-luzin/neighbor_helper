const {
  BUTTON_HOME,
  BUTTON_BACK,
} = require('../../constants/button.text').COMMON;

const addAssignmentLocationKeyboardTemplate = (buttons) => {
  const keyboard = Array.from(buttons);
  keyboard.push([BUTTON_HOME, BUTTON_BACK]);
  return keyboard;
};

module.exports = addAssignmentLocationKeyboardTemplate;
