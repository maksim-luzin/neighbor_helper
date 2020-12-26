const {
  ADD_ASSIGNMENT_FLOW_STEPS,
  EDIT_ASSIGNMENT_FLOW_STEPS,
} = require('../../constants/flow.step');

const { addMenuSelectCategoryForEditAssignmentAction } = require('../../actions/editAssignmentAction');

// eslint-disable-next-line consistent-return
const buttonEditAssignmentHandler = (request, state) => {
  let response;
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_ASSIGNMENT_FLOW_STEPS.PUBLISH_ASSIGNMENT:
    case EDIT_ASSIGNMENT_FLOW_STEPS.PUBLISH_ASSIGNMENT:
      return addMenuSelectCategoryForEditAssignmentAction(request, state);
  }
};

module.exports = buttonEditAssignmentHandler;
