const {
  BUTTON_CONFIRM,
  BUTTON_BACK,
} = require('../../constants/button.text').COMMON;

const removeAssignmentKeyboardTemplate = (assignmentId) => [
  [
    {
      text: BUTTON_CONFIRM,
      callback_data: `confirmAssignmentRemoveAction.${assignmentId}`,
    },
  ],
  [
    {
      text: BUTTON_BACK,
      callback_data: `backFromConfirmAssignmentRemoveAction.${assignmentId}`,
    },
  ],
];

module.exports = removeAssignmentKeyboardTemplate;
