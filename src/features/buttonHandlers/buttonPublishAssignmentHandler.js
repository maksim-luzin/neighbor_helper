const {
  ADD_ASSIGNMENT_FLOW_STEPS,
  EDIT_ASSIGNMENT_FLOW_STEPS,
} = require('../../constants/flow.step');

const { publishAddAssignmentAction } = require('../../actions/addAssignmentAction');
const { publishEditAssignmentAction } = require('../../actions/editAssignmentAction');

// eslint-disable-next-line consistent-return
const buttonPublishAssignmentHandler = (request, state) => {
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_ASSIGNMENT_FLOW_STEPS.PUBLISH_ASSIGNMENT:
      // eslint-disable-next-line no-case-declarations
      return publishAddAssignmentAction(request, state);

    case EDIT_ASSIGNMENT_FLOW_STEPS.PUBLISH_ASSIGNMENT:
      return publishEditAssignmentAction(request, state);
  }
};

module.exports = buttonPublishAssignmentHandler;
