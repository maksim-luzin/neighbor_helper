/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
const openGeocoder = require('node-open-geocoder');

const responseMessage = require('../helpers/responseMessage');
const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplate');
const { update } = require('../services').userService;
const { create, updateLocation } = require('../services').locationService;
const { setState } = require('../helpers/state');
const { ADD_LOCATION_NAME } = require('../constants/flow.step').ADD_LOCATION;
const {
  addLocationNameMessageTemplate,
  returnMainMenuMessageAfterCreateLocationTemplate,
  returnMainMenuMessageAfterUpdateLocationTemplate,
} = require('../templates/locationTemplates');
const addLocationNamesToKeyboard = require('../helpers/locationNamesKeyboard');

const addLocationAction = async (message) => {
  const { location } = message;
  const globalName = await addGlobalName(location);
  const locationNameKeyboard = await addLocationNamesToKeyboard(message.from.id);

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
    locationNameKeyboard.cache,
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
  if (state.cache[message.text]) {
    // eslint-disable-next-line no-const-assign
    await updateOldLocation(message, state);
    messageResponse = returnMainMenuMessageAfterUpdateLocationTemplate;
  } else {
    // eslint-disable-next-line no-const-assign
    await createNewLocation(message, state);
    messageResponse = returnMainMenuMessageAfterCreateLocationTemplate;
  }
  await setState(message.from.id);
  messageResponse = messageResponse.replace(/Локация/, `Локация ${message.text}`);

  return responseMessage(
    message,
    messageResponse,
    mainMenuKeyboardTemplate,
    null,
    null,
    2,
  );
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
  const result = await create({
    ...state.data,
    localName: message.text,
  });
  if (!result.succeeded) throw Error(result.message);
}

async function updateOldLocation(message, state) {
  const result = await updateLocation({
    ...state.data,
    id: state.cache[message.text],
  });
  if (!result.succeeded) throw Error(result.message);
}
