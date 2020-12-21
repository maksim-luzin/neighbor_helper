const {
  addLocalNameLocationAction,
} = require('../actions/locationAction');

const {
  addFoundAssignmentCategoryAction,
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
  ADD_LOCATION_NAME,
} = require('../constants/flow.step').ADD_LOCATION;

const {
  CHOOSE_CATEGORY,
  CHOOSE_LOCATION,
} = require('../constants/flow.step').FIND_ASSIGNMENTS;

const {
  CHANGE_RANGE,
} = require('../constants/flow.step').CHANGE_RANGE;

const { ADD_ASSIGNMENT } = require('../constants/flow.step');
const { EDIT_ASSIGNMENT } = require('../constants/flow.step');

// eslint-disable-next-line consistent-return
const stateDefaultHandler = (request, state) => {
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_LOCATION_NAME:
      return addLocalNameLocationAction(request, state);

    case CHOOSE_LOCATION:
      return addFoundAssignmentLocationAction({ request, state });

    case CHANGE_RANGE:
      return changeRangeAction(request, state);

    // Add assignmet
    case ADD_ASSIGNMENT.CHOOSE_CATEGORY:
      return chooseCategoryAssignmentAction(request, state, false);

    case ADD_ASSIGNMENT.ADD_TITLE:
      return addTitleForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT.ADD_DESCRIPTION:
      return addDescriptionForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT.CHOOSE_LOCATION:
      return chooseLocationForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT.ADD_REWARD:
      return addRewardForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT.SHOW_ASSIGNMENT:
      return addPictureForAddAssignmentAction(request, state);

    // Edit assignmet
    case EDIT_ASSIGNMENT.CHOOSE_CATEGORY:
      return chooseCategoryForEditAssignmentAction(request, state, false);

    case EDIT_ASSIGNMENT.EDIT_TITLE:
      return editTitleForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT.EDIT_DESCRIPTION:
      return editDescriptionForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT.CHOOSE_LOCATION:
      return chooseLocationForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT.EDIT_REWARD:
      return editRewardForEditAssignmentAction(request, state);

    case EDIT_ASSIGNMENT.SHOW_ASSIGNMENT:
      return editPictureForEditAssignmentAction(request, state);
  }
};

exports.stateDefaultHandler = stateDefaultHandler;
