const {
  ADD_LOCATION_FLOW_STEPS,
  ADD_ASSIGNMENT_FLOW_STEPS,
  EDIT_ASSIGNMENT_FLOW_STEPS,
  FIND_ASSIGNMENTS_FLOW_STEPS,
} = require('../../constants/flow.step');

const {
  findAssignmentsAction,
  addMenuSelectCategoryForCreatedAssignmentAction,
} = require('../../actions/mainActions');

const {
  addMenuAddLocationAction,
} = require('../../actions/commonActions');

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

const {
  chooseCategoryForEditAssignmentAction,
  editTitleForEditAssignmentAction,
  editDescriptionForEditAssignmentAction,
  chooseLocationForEditAssignmentAction,
  editRewardForEditAssignmentAction,
  addMenuSelectCategoryForEditAssignmentAction,
} = require('../../actions/editAssignmentAction');

// eslint-disable-next-line consistent-return
const buttonBackHandler = (request, state) => {
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_LOCATION_FLOW_STEPS.ADD_LOCATION_NAME:
      // eslint-disable-next-line no-case-declarations
      return addMenuAddLocationAction(request, state);

    case FIND_ASSIGNMENTS_FLOW_STEPS.CHOOSE_LOCATION:
      return findAssignmentsAction(request);

    case FIND_ASSIGNMENTS_FLOW_STEPS.GET_ASSIGNMENTS:
      return addFoundAssignmentCategoryAction(request, state);

    // Add assignment
    case ADD_ASSIGNMENT_FLOW_STEPS.ADD_TITLE:
      return addMenuSelectCategoryForCreatedAssignmentAction(request, state);

    case ADD_ASSIGNMENT_FLOW_STEPS.ADD_DESCRIPTION:
      return chooseCategoryAssignmentAction(request, state);

    case ADD_ASSIGNMENT_FLOW_STEPS.CHOOSE_LOCATION:
      return addTitleForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT_FLOW_STEPS.ADD_REWARD:
      return addDescriptionForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT_FLOW_STEPS.SHOW_ASSIGNMENT:
      return chooseLocationForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT_FLOW_STEPS.PUBLISH_ASSIGNMENT:
      return addRewardForAddAssignmentAction(request, state);

    // Edit assignment
    case EDIT_ASSIGNMENT_FLOW_STEPS.EDIT_TITLE:
      return addMenuSelectCategoryForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT_FLOW_STEPS.EDIT_DESCRIPTION:
      return chooseCategoryForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT_FLOW_STEPS.CHOOSE_LOCATION:
      return editTitleForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT_FLOW_STEPS.EDIT_REWARD:
      return editDescriptionForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT_FLOW_STEPS.SHOW_ASSIGNMENT:
      return chooseLocationForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT_FLOW_STEPS.PUBLISH_ASSIGNMENT:
      return editRewardForEditAssignmentAction(request, state);
  }
};

module.exports = buttonBackHandler;
