const {
  BUTTON_BACK,
} = require('../../constants/button.text').COMMON;

const chooseLocationKeyboardTemplate = (buttons) => {
  const keyboard = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < buttons.length; i++) { // отображение по две локации на одну строку
    if (i % 2 === 0) keyboard.push([buttons[i]]);
    else keyboard[keyboard.length - 1].push(buttons[i]);
  }
  // keyboard.push([BUTTON_ADD_NEW_LOCATION]); // not implemented yet
  keyboard.push([
    {
      text: BUTTON_BACK,
      callback_data: 'goBackAction',
    },
  ]);
  return keyboard;
};

module.exports = chooseLocationKeyboardTemplate;
