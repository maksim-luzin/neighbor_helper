const {
  commonKeyboardTemplate,
} = require('../../templates/commonTemplates');

const {
  getAllByTelegramId,
} = require('../../services/location.service');

const { COMMON_BUTTONS } = require('../../constants/button.text');

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
        [COMMON_BUTTONS.ADD_LOCATION],
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
