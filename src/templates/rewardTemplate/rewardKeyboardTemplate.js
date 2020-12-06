const {
  BUTTON_BACK,
} = require('../../constants/button.text').COMMON;

const rewardKeyboardTemplate = [
  [
    {
      text: BUTTON_BACK,
      callback_data: 'goBackAction',
    },
  ],
];

module.exports = rewardKeyboardTemplate;
