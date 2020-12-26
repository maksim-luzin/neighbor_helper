/* eslint-disable default-case */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
const openGeocoder = require('node-open-geocoder');

const {
  ADD_LOCATION_FLOW_STEPS,
  ADD_ASSIGNMENT_FLOW_STEPS,
  EDIT_ASSIGNMENT_FLOW_STEPS,
  FIND_ASSIGNMENTS_FLOW_STEPS,
} = require('../constants/flow.step');

const {
  addLocationNameMessageTemplate,
  returnMainMenuMessageAfterCreateLocationTemplate,
  returnMainMenuMessageAfterUpdateLocationTemplate,
} = require('../templates/locationTemplates');

const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplates');

const addLocationNamesToKeyboard = require('../helpers/locationNamesKeyboard');
const responseMessage = require('../helpers/responseMessage');

const { buttonBackHandler } = require('../features/buttonHandlers');
const { BACK } = require('../constants/button.text').COMMON_BUTTONS;

const { locationService } = require('../services');
const { setState } = require('../helpers/state');

const addLocationAction = async (message, state) => {
  const { location } = message;
  const globalName = await addGlobalName(location);
  const locationNameKeyboard = await addLocationNamesToKeyboard(message.from.id, false);

  await setState(
    message.from.id,
    ADD_LOCATION_FLOW_STEPS.ADD_LOCATION_NAME,
    {
      telegramId: message.from.id,
      globalName,
      coordinates: [
        location.longitude,
        location.latitude,
      ],
    },
    {
      ...state.cache,
      locationNameKeyboard: locationNameKeyboard.cache,
    },
  );

  return responseMessage(
    message,
    addLocationNameMessageTemplate,
    locationNameKeyboard.keyboard,
    null,
    null,
    2,
  );
};

const addLocalNameLocationAction = async (message, state) => {
  let messageResponse = '';
  if (state.cache.locationNameKeyboard[message.text]) {
    // eslint-disable-next-line no-const-assign
    await updateOldLocation(message, state);
    messageResponse = returnMainMenuMessageAfterUpdateLocationTemplate;
  } else {
    // eslint-disable-next-line no-const-assign
    await createNewLocation(message, state);
    messageResponse = returnMainMenuMessageAfterCreateLocationTemplate;
  }

  if (state.cache.stepToReturn) {
    return await buttonBackHandler(
      { ...message, text: BACK },
      {
        step: stepToReturn(state.cache.stepToReturn),
        data: state.cache.data,
        cache: { ...state.cache.cache, deleteMessage: 2 },
      },
    );
  } else {
    messageResponse = messageResponse.replace(/Локация/, `Локация ${message.text}`);
    await setState(message.from.id, state.cache.stepToReturn);

    return responseMessage(
      message,
      messageResponse,
      mainMenuKeyboardTemplate,
      null,
      null,
      2,
    );
  }
};

module.exports = {
  addLocationAction,
  addLocalNameLocationAction,
};

async function addGlobalName(location) {
  return new Promise((resolve, reject) => (
    openGeocoder()
      .reverse(location.longitude, location.latitude)
      .end((err, { address }) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        if (err) reject(Error('Global name hasn\'t created.'));
        const response = (
          address.city
          || address.town
          || address.town
          || address.village
          || address.hallmet
          || address.state
          || ''
        );
        if (!address.road) return resolve(response);

        let { road } = address;
        const str = (road.match(/(^| )(пер|пров|наб|бульв|в?ул|п(р|л))/i) || [''])[0];
        road = road.replace(/(^| )((пере|пров)улок|набережная?|бульвар|в?улиц(а|я)|проспект|площа(дь)?)/i, '');
        resolve(`${response} ${str || ''}. ${road || ''}`);
      })
  ));
}

async function createNewLocation(message, state) {
  const result = await locationService.create({
    ...state.data,
    localName: message.text,
  });
  if (!result.succeeded) throw Error(result.message);
}

async function updateOldLocation(message, state) {
  const result = await locationService.updateLocation({
    ...state.data,
    id: state.cache.locationNameKeyboard[message.text],
  });
  if (!result.succeeded) throw Error(result.message);
}

function stepToReturn(step) {
  switch (step) {
    case ADD_ASSIGNMENT_FLOW_STEPS.CHOOSE_LOCATION:
      return ADD_ASSIGNMENT_FLOW_STEPS.ADD_REWARD;

    case EDIT_ASSIGNMENT_FLOW_STEPS.CHOOSE_LOCATION:
      return EDIT_ASSIGNMENT_FLOW_STEPS.EDIT_REWARD;

    case FIND_ASSIGNMENTS_FLOW_STEPS.CHOOSE_LOCATION:
      return FIND_ASSIGNMENTS_FLOW_STEPS.GET_ASSIGNMENTS;
  }
}
