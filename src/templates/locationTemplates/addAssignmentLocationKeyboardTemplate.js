const { COMMON_BUTTONS } = require('../../constants/button.text');

const addAssignmentLocationKeyboardTemplate = (buttons) => {
  const keyboard = Array.from(buttons);
  keyboard.push([COMMON_BUTTONS.HOME, COMMON_BUTTONS.BACK]);
  return keyboard;
};

module.exports = addAssignmentLocationKeyboardTemplate;
