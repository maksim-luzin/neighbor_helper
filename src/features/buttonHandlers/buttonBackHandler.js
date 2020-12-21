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
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_LOCATION.ADD_LOCATION_NAME:
      return addMenuAddLocationAction(request);

    case findAssignmentsFlowSteps.CHOOSE_LOCATION:
      return findAssignmentsAction(request);

    case findAssignmentsFlowSteps.GET_ASSIGNMENTS:
      return addFoundAssignmentCategoryAction(request, state);

    // Add assignmet
    case ADD_ASSIGNMENT.ADD_TITLE:
      return addMenuSelectCategoryForCreatedAssignmentAction(request, state);

    case ADD_ASSIGNMENT.ADD_DESCRIPTION:
      return chooseCategoryAssignmentAction(request, state);

    case ADD_ASSIGNMENT.CHOOSE_LOCATION:
      return addTitleForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT.ADD_REWARD:
      return addDescriptionForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT.ADD_PICTURE:
      return chooseLocationForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT.SHOW_ASSIGNMENT:
      return addRewardForAddAssignmentAction(request, state);
  }
};

module.exports = buttonBackHandler;
