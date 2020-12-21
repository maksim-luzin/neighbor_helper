const findAssignmentsFlowSteps = require('../../constants/flow.step').FIND_ASSIGNMENTS;
const { ADD_ASSIGNMENT } = require('../../constants/flow.step');

const {
  addFoundAssignmentCategoryAction,
} = require('../../actions/assignmentActions');

const {
  chooseCategoryAssignmentAction,
} = require('../../actions/addAssignmentAction');

// eslint-disable-next-line consistent-return
const categoryHandler = async (request, state) => {
  // eslint-disable-next-line default-case
  switch (state.step) {
    case findAssignmentsFlowSteps.CHOOSE_CATEGORY:
      return addFoundAssignmentCategoryAction(request, state);

    case ADD_ASSIGNMENT.CHOOSE_CATEGORY:
      return chooseCategoryAssignmentAction(request, state, true);
  }

  return false;
};

module.exports = categoryHandler;
