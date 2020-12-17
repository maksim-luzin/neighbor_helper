const findAssignmentsFlowSteps = require('../../constants/flow.step').FIND_ASSIGNMENTS;
const { ADD_ASSIGNMENT } = require('../../constants/flow.step');

const {
  addFoundAssignmentCategoryAction,
} = require('../../actions/assignmentActions');

const {
  chooseCategoryAssignmentAction,
} = require('../../actions/addAssignmentAction');

//TODO return function() (without await)

// eslint-disable-next-line consistent-return
const categoryHandler = async (request, state) => {
  let response;
  // eslint-disable-next-line default-case
  switch (state.step) {
    case findAssignmentsFlowSteps.CHOOSE_CATEGORY:
      response = await addFoundAssignmentCategoryAction(request, state);
      return response;

    case ADD_ASSIGNMENT.CHOOSE_CATEGORY:
      response = await chooseCategoryAssignmentAction(request, state, true);
      return response;
  }

  return false;
};

module.exports = categoryHandler;
