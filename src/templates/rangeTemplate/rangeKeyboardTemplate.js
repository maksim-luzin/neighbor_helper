const {
  BUTTON_MORE,
  BUTTON_LESS,
} = require('../../constants/button.text').CHANGE_RANGE;

const rangeKeyboardTemplate = [
  [
    {
      text: BUTTON_LESS,
      callback_data: 'changeRangeAction.-', // callback_data является строкой, поэтому я
      // кладу название экшена, который должен сработать, и через точку пишу минус, означающий что
      // было вызвано уменьшение радиуса. В экшене идёт сплит строки.
    },
    {
      text: BUTTON_MORE,
      callback_data: 'changeRangeAction.+',
    }],
];

module.exports = rangeKeyboardTemplate;
