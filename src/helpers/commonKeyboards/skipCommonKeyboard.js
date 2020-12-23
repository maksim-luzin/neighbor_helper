const responseMessage = require('../responseMessage');
const { skipCommonKeyboardTemplate } = require('../../templates/commonTemplates');

const skipCommonKeyboard = (
  resMessage,
  message,
  assignment,
) => responseMessage(
  message,
  resMessage,
  skipCommonKeyboardTemplate,
  null,
  assignment,
  3,
);

module.exports = skipCommonKeyboard;
