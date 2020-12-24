const {
  commonKeyboardTemplate,
} = require('../../templates/commonTemplates');

const {
  getAllByTelegramId,
} = require('../../services/location.service');

const { BUTTON_ADD_LOCATION } = require('../../constants/button.text').COMMON;

const addLocationNamesToKeyboard = async (telegramId, addLocationKey = true) => {
  const result = await getAllByTelegramId({ telegramId });
  if (!result.succeeded) throw Error(result.message);
  const locations = result.model || [];

  const addLocationNamesKeyboardTemplate = locations.map(({ localName }) => [localName]).sort();
  const cache = {};
  locations.forEach((location) => {
    cache[location.localName] = location.id;
  });

  if (addLocationKey) {
    return {
      keyboard: [
        ...addLocationNamesKeyboardTemplate,
        [BUTTON_ADD_LOCATION],
        ...commonKeyboardTemplate,
      ],
      cache,
    };
  }
  return {
    keyboard: [
      ...addLocationNamesKeyboardTemplate,
      ...commonKeyboardTemplate,
    ],
    cache,
  };
};

module.exports = addLocationNamesToKeyboard;
