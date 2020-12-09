const findAssignmentsFlowSteps = require('../../constants/flow.step').FIND_ASSIGNMENTS;

const {
  ADD_LOCATION_NAME,
} = require('../../constants/flow.step').ADD_LOCATION;

const {
  addMenuAddLocationAction,
  findAssignmentsAction,
} = require('../../actions/mainActions');

const {
  addFoundAssignmentCategoryAction,
} = require('../../actions/assignmentActions');

// eslint-disable-next-line consistent-return
const buttonBackHandler = async (request, state) => {
  let response;
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_LOCATION_NAME:
      // eslint-disable-next-line no-case-declarations
      response = await addMenuAddLocationAction(request);
      return response;

    case findAssignmentsFlowSteps.CHOOSE_LOCATION:
      response = await findAssignmentsAction(request);
      return response;

    case findAssignmentsFlowSteps.GET_ASSIGNMENTS:
      response = await addFoundAssignmentCategoryAction(request, state);
      return response;
  }
};

module.exports = buttonBackHandler;
