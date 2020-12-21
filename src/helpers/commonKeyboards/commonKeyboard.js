const responseMessage = require('../responseMessage');
const { commonKeyboardTemplate } = require('../../templates/commonTemplates');

const commonKeyboard = (
  resMessage,
  message,
  assignment = null,
  numberMessageForDelete = 3,
) => responseMessage(
  message,
  resMessage,
  commonKeyboardTemplate,
  null,
  assignment,
  numberMessageForDelete,
);

module.exports = commonKeyboard;
