const {
  addLocalNameLocationAction,
} = require('../actions/locationAction');

const {
  addFoundAssignmentCategoryAction,
  addFoundAssignmentLocationAction,
} = require('../actions/assignmentActions');

const {
  ADD_LOCATION_NAME,
} = require('../constants/flow.step').ADD_LOCATION;

const {
  CHOOSE_CATEGORY,
  CHOOSE_LOCATION,
} = require('../constants/flow.step').FIND_ASSIGNMENTS;

// eslint-disable-next-line consistent-return
const stateDefaultHandler = async (request, state) => {
  let response = false;
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_LOCATION_NAME:
      response = await addLocalNameLocationAction(request, state);
      return response;
    case CHOOSE_CATEGORY:
      response = await addFoundAssignmentCategoryAction(request, state);
      return response;
    case CHOOSE_LOCATION:
      response = await addFoundAssignmentLocationAction(request, state);
      return response;
  }
};

exports.stateDefaultHandler = stateDefaultHandler;
