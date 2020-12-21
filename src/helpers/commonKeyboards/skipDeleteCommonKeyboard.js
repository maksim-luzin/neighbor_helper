const responseMessage = require('../responseMessage');
const { skipDeleteCommonKeyboardTemplate } = require('../../templates/commonTemplates');

const skipDeleteCommonKeyboard = (
  resMessage,
  message,
  assignment,
) => responseMessage(
  message,
  resMessage,
  skipDeleteCommonKeyboardTemplate,
  null,
  assignment,
  3,
);

module.exports = skipDeleteCommonKeyboard;
