const { COMMON_BUTTONS, ADD_LOCATIONS_MENU_BUTTONS } = require('../../constants/button.text');

const addLocationMenuKeyboardTemplate = [
  [{
    text: ADD_LOCATIONS_MENU_BUTTONS.ADD_CURRENT_LOCATION,
    request_location: true,
  }],
  [COMMON_BUTTONS.HOME],
];

module.exports = addLocationMenuKeyboardTemplate;
