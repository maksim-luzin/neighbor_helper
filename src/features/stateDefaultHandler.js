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
  let response = false;
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_LOCATION_NAME:
      //TODO return addLocalNameLocationAction(...)
      response = await addLocalNameLocationAction(request, state);
      return response;
    case CHOOSE_LOCATION:
      //TODO same
      response = await addFoundAssignmentLocationAction({ request, state });
      return response;
    case CHANGE_RANGE:
      //TODO same
      response = await changeRangeAction(request, state);
      return response;

    // Add assignmet
    case ADD_ASSIGNMENT.CHOOSE_CATEGORY:
      //TODO same
      response = await chooseCategoryAssignmentAction(request, state, false);
      return response;

    case ADD_ASSIGNMENT.ADD_TITLE:
      //TODO same
      response = await addTitleForAddAssignmentAction(request, state);
      return response;

    case ADD_ASSIGNMENT.ADD_DESCRIPTION:
      response = await addDescriptionForAddAssignmentAction(request, state);
      return response;

    case ADD_ASSIGNMENT.CHOOSE_LOCATION:
      response = await chooseLocationForAddAssignmentAction(request, state);
      return response;

    case ADD_ASSIGNMENT.ADD_REWARD:
      response = await addRewardForAddAssignmentAction(request, state);
      return response;

    case ADD_ASSIGNMENT.SHOW_ASSIGNMENT:
      response = await addPictureForAddAssignmentAction(request, state);
      return response;
  }
};

exports.stateDefaultHandler = stateDefaultHandler;
