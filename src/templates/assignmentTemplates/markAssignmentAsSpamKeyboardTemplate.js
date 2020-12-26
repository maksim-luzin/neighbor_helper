const { COMMON_BUTTONS } = require('../../constants/button.text');
const { ASSIGNMENT_ACTIONS } = require('../../constants/actions');

const markAssignmentAsSpamKeyboardTemplate = (assignmentId) => [
  [
    {
      text: COMMON_BUTTONS.CONFIRM,
      callback_data: `${ASSIGNMENT_ACTIONS.CONFIRM_ASSIGNMENT_AS_SPAM}.${assignmentId}`,
    },
  ],
  [
    {
      text: COMMON_BUTTONS.BACK,
      callback_data: `${ASSIGNMENT_ACTIONS.BACK_FROM_CONFIRM_ASSIGNMENT_AS_SPAM}.${assignmentId}`,
    },
  ],
];

module.exports = markAssignmentAsSpamKeyboardTemplate;
