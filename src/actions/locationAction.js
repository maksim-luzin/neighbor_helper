/* eslint-disable no-use-before-define */
const openGeocoder = require('node-open-geocoder');
const { telegramTemplate } = require('claudia-bot-builder');

const { messageDefaultAction } = require('./commonActions');
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
  addLocationNameKeyboardTemplate,
  returnMainMenuMessageAfterCreateLocationTemplate,
  returnMainMenuMessageAfterUpdateLocationTemplate,
} = require('../templates/locationTemplates');

const {
  getAllByTelegramId,
} = require('../services/location.service');

const addLocationAction = async (message) => {
  const { location } = message;
  // eslint-disable-next-line no-use-before-define
  // eslint-disable-next-line max-len
  const globalName = await new Promise((resolve, reject) => (
    addGlobalName(location, resolve, reject)
  ));
  // eslint-disable-next-line no-use-before-define
  const locationNameKeyboard = await addLocationNamesToKeyboard(message);

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

  // Add keyboard
  return (
    new telegramTemplate.Text(addLocationNameMessageTemplate)
      .addReplyKeyboard(
        locationNameKeyboard.keyboard,
        { one_time_keyboard: true },
      )
      .get());
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
  return (
    new telegramTemplate.Text(messageResponse)
      .addReplyKeyboard(
        mainMenuKeyboardTemplate,
        { one_time_keyboard: true },
      )
      .get());
};

module.exports = {
  addLocationAction,
  addLocalNameLocationAction,
};

async function addGlobalName(location, resolve, reject) {
  openGeocoder()
    .reverse(location.longitude, location.latitude)
    .end((err, res) => {
      let response = '';
      if (err) reject();
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
    });
}

async function addLocationNamesToKeyboard(message) {
  const result = await getAllByTelegramId({ telegramId: message.from.id });
  if (!result.succeeded) return messageDefaultAction();
  const locations = result.model || [];

  const addLocationNamesKeyboardTemplate = locations.map(({ localName }) => [localName]).sort();
  const cache = {};
  locations.forEach((location) => {
    cache[location.localName] = location.id;
  });

  return {
    keyboard: [
      ...addLocationNamesKeyboardTemplate,
      ...addLocationNameKeyboardTemplate,
    ],
    cache,
  };
}

// eslint-disable-next-line consistent-return
async function createNewLocation(message, state) {
  const result = await create({
    ...state.data,
    localName: message.text,
  });
  if (!result.succeeded) return messageDefaultAction();
}

// eslint-disable-next-line consistent-return
async function updateOldLocation(message, state) {
  const result = await updateLocation({
    ...state.data,
    id: state.cache[message.text],
  });
  if (!result.succeeded) return messageDefaultAction();
}
