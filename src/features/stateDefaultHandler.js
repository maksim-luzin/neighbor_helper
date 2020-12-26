const {
  addLocalNameLocationAction,
} = require('../actions/locationAction');

const {
  addFoundAssignmentLocationAction,
} = require('../actions/assignmentActions');

const {
  changeRangeAction,
} = require('../actions/mainActions');

const {
  chooseCategoryAssignmentAction,
  addTitleForAddAssignmentAction,
  addDescriptionForAddAssignmentAction,
  chooseLocationForAddAssignmentAction,
  addRewardForAddAssignmentAction,
  addPictureForAddAssignmentAction,
} = require('../actions/addAssignmentAction');

const {
  chooseCategoryForEditAssignmentAction,
  editTitleForEditAssignmentAction,
  editDescriptionForEditAssignmentAction,
  chooseLocationForEditAssignmentAction,
  editRewardForEditAssignmentAction,
  editPictureForEditAssignmentAction,
} = require('../actions/editAssignmentAction');

const {
  ADD_ASSIGNMENT_FLOW_STEPS,
  EDIT_ASSIGNMENT_FLOW_STEPS,
  FIND_ASSIGNMENTS_FLOW_STEPS,
  ADD_LOCATION_FLOW_STEPS,
  CHANGE_RANGE_FLOW_STEPS,
} = require('../constants/flow.step');

// eslint-disable-next-line consistent-return
const stateDefaultHandler = (request, state) => {
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_LOCATION_FLOW_STEPS.ADD_LOCATION_NAME:
      return addLocalNameLocationAction(request, state);

    case FIND_ASSIGNMENTS_FLOW_STEPS.CHOOSE_LOCATION:
      return addFoundAssignmentLocationAction({ request, state });

    case CHANGE_RANGE_FLOW_STEPS.CHANGE_RANGE:
      return changeRangeAction(request);

    // Add assignment
    case ADD_ASSIGNMENT_FLOW_STEPS.CHOOSE_CATEGORY:
      return chooseCategoryAssignmentAction(request, state, false);

    case ADD_ASSIGNMENT_FLOW_STEPS.ADD_TITLE:
      return addTitleForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT_FLOW_STEPS.ADD_DESCRIPTION:
      return addDescriptionForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT_FLOW_STEPS.CHOOSE_LOCATION:
      return chooseLocationForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT_FLOW_STEPS.ADD_REWARD:
      return addRewardForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT_FLOW_STEPS.SHOW_ASSIGNMENT:
      return addPictureForAddAssignmentAction(request, state);

    // Edit assignment
    case EDIT_ASSIGNMENT_FLOW_STEPS.CHOOSE_CATEGORY:
      return chooseCategoryForEditAssignmentAction(request, state, false);

    case EDIT_ASSIGNMENT_FLOW_STEPS.EDIT_TITLE:
      return editTitleForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT_FLOW_STEPS.EDIT_DESCRIPTION:
      return editDescriptionForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT_FLOW_STEPS.CHOOSE_LOCATION:
      return chooseLocationForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT_FLOW_STEPS.EDIT_REWARD:
      return editRewardForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT_FLOW_STEPS.SHOW_ASSIGNMENT:
      return editPictureForEditAssignmentAction(request, state);
  }
};

exports.stateDefaultHandler = stateDefaultHandler;
