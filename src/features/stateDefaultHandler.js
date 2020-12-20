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

// eslint-disable-next-line consistent-return
const stateDefaultHandler = async (request, state) => {
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_LOCATION_NAME:
      return await addLocalNameLocationAction(request, state);

    case CHOOSE_LOCATION:
      return await addFoundAssignmentLocationAction({ request, state });

    case CHANGE_RANGE:
      return await changeRangeAction(request, state);

    // Add assignmet
    case ADD_ASSIGNMENT.CHOOSE_CATEGORY:
      return await chooseCategoryAssignmentAction(request, state, false);

    case ADD_ASSIGNMENT.ADD_TITLE:
      return await addTitleForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT.ADD_DESCRIPTION:
      return await addDescriptionForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT.CHOOSE_LOCATION:
      return await chooseLocationForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT.ADD_REWARD:
      return await addRewardForAddAssignmentAction(request, state);

    case ADD_ASSIGNMENT.SHOW_ASSIGNMENT:
      return await addPictureForAddAssignmentAction(request, state);
  }
};

exports.stateDefaultHandler = stateDefaultHandler;
