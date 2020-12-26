const {
  FIND_ASSIGNMENTS_FLOW_STEPS,
  ADD_ASSIGNMENT_FLOW_STEPS,
  EDIT_ASSIGNMENT_FLOW_STEPS,
} = require('../../constants/flow.step');

const {
  addFoundAssignmentCategoryAction,
} = require('../../actions/assignmentActions');

const {
  chooseCategoryAssignmentAction,
} = require('../../actions/addAssignmentAction');

const {
  chooseCategoryForEditAssignmentAction,
} = require('../../actions/editAssignmentAction');

// eslint-disable-next-line consistent-return
const categoryHandler = (request, state) => {
  // eslint-disable-next-line default-case
  switch (state.step) {
    case FIND_ASSIGNMENTS_FLOW_STEPS.CHOOSE_CATEGORY:
      return addFoundAssignmentCategoryAction(request, state);

    case ADD_ASSIGNMENT_FLOW_STEPS.CHOOSE_CATEGORY:
      return chooseCategoryAssignmentAction(request, state, true);

    case EDIT_ASSIGNMENT_FLOW_STEPS.CHOOSE_CATEGORY:
      return chooseCategoryForEditAssignmentAction(request, state, true);
  }
};

module.exports = categoryHandler;
