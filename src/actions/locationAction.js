/* eslint-disable vars-on-top */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
const openGeocoder = require('node-open-geocoder');

const responseMessage = require('../helpers/responseMessage');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplate');
const { create, updateLocation } = require('../services').locationService;
const { setState } = require('../helpers/state');
const {
  ADD_LOCATION,
  ADD_LOCATION_NAME,
} = require('../constants/flow.step').ADD_LOCATION;
const { BUTTON_BACK } = require('../constants/button.text').COMMON;

const {
  ADD_ASSIGNMENT,
  EDIT_ASSIGNMENT,
} = require('../constants/flow.step');

const {
  addLocationMessageTemplate,
  addLocationKeyboardTemplate,
  addLocationNameMessageTemplate,
  returnMainMenuMessageAfterCreateLocationTemplate,
  returnMainMenuMessageAfterUpdateLocationTemplate,
} = require('../templates/locationTemplates');
const addLocationNamesToKeyboard = require('../helpers/locationNamesKeyboard');

const { buttonBackHandler } = require('../features/buttonHandlers');

const addMenuAddLocationAction = async (message, state) => {
  // eslint-disable-next-line no-use-before-define
  await setState(
    message.from.id,
    ADD_LOCATION,
    null,
    {
      stepToReturn: state.step,
      data: state.data,
      cache: state.cache,
    },
  );

  return responseMessage(
    message,
    addLocationMessageTemplate,
    addLocationKeyboardTemplate,
    null,
    null,
    state.step
      ? 3
      : 1,
  );
};

const addLocationAction = async (message, state) => {
  const { location } = message;
  const globalName = await addGlobalName(location);
  const locationNameKeyboard = await addLocationNamesToKeyboard(message.from.id, false);

  await setState(
    message.from.id,
    ADD_LOCATION_NAME,
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
      { ...message, text: BUTTON_BACK },
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
  addMenuAddLocationAction,
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
  const result = await create({
    ...state.data,
    localName: message.text,
  });
  if (!result.succeeded) throw Error(result.message);
}

async function updateOldLocation(message, state) {
  const result = await updateLocation({
    ...state.data,
    id: state.cache.locationNameKeyboard[message.text],
  });
  if (!result.succeeded) throw Error(result.message);
}

function stepToReturn(step) {
  if (step === ADD_ASSIGNMENT.CHOOSE_LOCATION) {
    return ADD_ASSIGNMENT.ADD_REWARD;
  } else {
    return EDIT_ASSIGNMENT.EDIT_REWARD;
  }
}
