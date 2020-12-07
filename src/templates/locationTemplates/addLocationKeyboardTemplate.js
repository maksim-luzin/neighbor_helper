const {
  BUTTON_ADD_CURRENT_LOCATION,
} = require('../../constants/button.text').ADD_LOCATIONS_MENU;

const {
  BUTTON_HOME,
} = require('../../constants/button.text').COMMON;

const addLocationMenuKeyboardTemplate = [
  [{
    text: BUTTON_ADD_CURRENT_LOCATION,
    request_location: true,
  }],
  [BUTTON_HOME],
];

module.exports = addLocationMenuKeyboardTemplate;
