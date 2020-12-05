// eslint-disable-next-line consistent-return
const {
  addLocalNameLocationAction,
} = require('../actions/locationAction');

const {
  ADD_LOCATION_NAME,
} = require('../constants/flow.step').ADD_LOCATION;

// eslint-disable-next-line consistent-return
const stateDefaultHandler = async (request, state) => {
  let response = false;
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_LOCATION_NAME:
      // eslint-disable-next-line no-case-declarations
      response = await addLocalNameLocationAction(request, state);
      return response;
  }
};

exports.stateDefaultHandler = stateDefaultHandler;
