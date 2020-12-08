const findAssignmentsFlowSteps = require('../../constants/flow.step').FIND_ASSIGNMENTS;

const {
  addFoundAssignmentCategoryAction,
} = require('../../actions/assignmentActions');

// eslint-disable-next-line consistent-return
const categoryHandler = async (request, state) => {
  let response;
  // eslint-disable-next-line default-case
  switch (state.step) {
    case findAssignmentsFlowSteps.CHOOSE_CATEGORY:
      response = await addFoundAssignmentCategoryAction(request, state);
      return response;
  }
};

module.exports = categoryHandler;
