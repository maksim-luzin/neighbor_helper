const {
  BUTTON_CONFIRM,
  BUTTON_BACK,
} = require('../../constants/button.text').COMMON;

const markAssignmentAsSpamKeyboardTemplate = (assignmentId) => [
  [
    {
      text: BUTTON_CONFIRM,
      callback_data: `confirmAssignmentAsSpamAction.${assignmentId}`,
    },
  ],
  [
    {
      text: BUTTON_BACK,
      callback_data: `backFromConfirmAssignmentAsSpamAction.${assignmentId}`,
    },
  ],
];

module.exports = markAssignmentAsSpamKeyboardTemplate;
