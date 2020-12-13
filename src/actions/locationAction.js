/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
const openGeocoder = require('node-open-geocoder');
const { telegramTemplate } = require('claudia-bot-builder');
const responseMessage = require('../helpers/responseMessage');

const { mainMenuKeyboardTemplate } = require('../templates/mainMenuTemplate');
const { update } = require('../services').userService;
const { create, updateLocation } = require('../services').locationService;
const setState = require('../helpers/setState');

const {
  ADD_LOCATION,
  ADD_LOCATION_NAME,
} = require('../constants/flow.step').ADD_LOCATION;

const {
  addLocationNameMessageTemplate,
  returnMainMenuMessageAfterCreateLocationTemplate,
  returnMainMenuMessageAfterUpdateLocationTemplate,
} = require('../templates/locationTemplates');

const {
  commonKeyboardTemplate,
} = require('../templates/commonTemplates');

const {
  getAllByTelegramId,
} = require('../services/location.service');

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
  );
};

module.exports = {
  addLocationAction,
  addLocalNameLocationAction,
};

async function addGlobalName(location, resolve, reject) {
  const response = await new Promise((resolve, reject) => (
    openGeocoder()
      .reverse(location.longitude, location.latitude)
      .end((err, res) => {
        let response = '';
        // eslint-disable-next-line prefer-promise-reject-errors
        if (err) reject(Error('Global name hasn\'t created.'));
        if (!res.address) resolve(response);
        const { address } = res;

        if (address.city) response = address.city;
        if (address.town) response = address.town;
        if (address.village) response = address.village;
        if (address.hallmet) response = address.hallmet;
        if (response && !address.road) resolve(response);

        if (response && address.road) {
          let { road } = address;
          const str = (road.match(/(^| )(пер|пров|наб|бульв|в?ул|п(р|л))/i) || [''])[0];
          road = road.replace(/(^| )((пере|пров)улок|набережная?|бульвар|в?улиц(а|я)|проспект|площа(дь)?)/i, '');
          resolve(`${response} ${str || ''}. ${road || ''}`);
        }
        if (address.state) resolve(address.state);
        resolve('');
      })
  ));
  return response;
}

// eslint-disable-next-line consistent-return
async function createNewLocation(message, state) {
  const result = await create({
    ...state.data,
    localName: message.text,
  });
  if (!result.succeeded) throw Error(result.message);
}

// eslint-disable-next-line consistent-return
async function updateOldLocation(message, state) {
  const result = await updateLocation({
    ...state.data,
    id: state.cache[message.text],
  });
  if (!result.succeeded) throw Error(result.message);
}
