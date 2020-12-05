const {
  ADD_LOCATION_NAME,
} = require('../../constants/flow.step').ADD_LOCATION;

const {
  addMenuAddLocationAction,
} = require('../../actions/mainActions');

// eslint-disable-next-line consistent-return
const buttonBackHandler = async (request, state) => {
  let response;
  // eslint-disable-next-line default-case
  switch (state.step) {
    case ADD_LOCATION_NAME:
      // eslint-disable-next-line no-case-declarations
      response = await addMenuAddLocationAction(request);
      return response;
  }
};

module.exports = buttonBackHandler;
