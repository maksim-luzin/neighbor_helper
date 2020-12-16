const findAssignmentsFlowSteps = require('../../constants/flow.step').FIND_ASSIGNMENTS;
const { ADD_LOCATION } = require('../../constants/flow.step');
const { ADD_ASSIGNMENT } = require('../../constants/flow.step');

const {
  addMenuAddLocationAction,
  findAssignmentsAction,
  addMenuSelectCategoryForCreatedAssignmentAction,
} = require('../../actions/mainActions');

const {
  addFoundAssignmentCategoryAction,
} = require('../../actions/assignmentActions');

const {
  chooseCategoryAssignmentAction,
  addTitleForAddAssignmentAction,
  addDescriptionForAddAssignmentAction,
  chooseLocationForAddAssignmentAction,
  addRewardForAddAssignmentAction,
} = require('../../actions/addAssignmentAction');

// eslint-disable-next-line consistent-return
const buttonBackHandler = async (request, state) => {
  let response;
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_LOCATION.ADD_LOCATION_NAME:
      // eslint-disable-next-line no-case-declarations
      response = await addMenuAddLocationAction(request);
      return response;

    case findAssignmentsFlowSteps.CHOOSE_LOCATION:
      response = await findAssignmentsAction(request);
      return response;

    case findAssignmentsFlowSteps.GET_ASSIGNMENTS:
      response = await addFoundAssignmentCategoryAction(request, state);
      return response;

    // Add assignmet
    case ADD_ASSIGNMENT.ADD_TITLE:
      response = await addMenuSelectCategoryForCreatedAssignmentAction(request, state);
      return response;

    case ADD_ASSIGNMENT.ADD_DESCRIPTION:
      response = await chooseCategoryAssignmentAction(request, state);
      return response;

    case ADD_ASSIGNMENT.CHOOSE_LOCATION:
      response = await addTitleForAddAssignmentAction(request, state);
      return response;

    case ADD_ASSIGNMENT.ADD_REWARD:
      response = await addDescriptionForAddAssignmentAction(request, state);
      return response;

    case ADD_ASSIGNMENT.ADD_PICTURE:
      response = await chooseLocationForAddAssignmentAction(request, state);
      return response;

    case ADD_ASSIGNMENT.SHOW_ASSIGNMENT:
      response = await addRewardForAddAssignmentAction(request, state);
      return response;
  }
};

module.exports = buttonBackHandler;
