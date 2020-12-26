const { COMMON_BUTTONS } = require('../../constants/button.text');
const { ASSIGNMENT_ACTIONS } = require('../../constants/actions');

const removeAssignmentKeyboardTemplate = (assignmentId) => [
  [
    {
      text: COMMON_BUTTONS.CONFIRM,
      callback_data: `${ASSIGNMENT_ACTIONS.CONFIRM_ASSIGNMENT_REMOVE}.${assignmentId}`,
    },
  ],
  [
    {
      text: COMMON_BUTTONS.BACK,
      callback_data: `${ASSIGNMENT_ACTIONS.BACK_FROM_CONFIRM_ASSIGNMENT_REMOVE}.${assignmentId}`,
    },
  ],
];

module.exports = removeAssignmentKeyboardTemplate;
