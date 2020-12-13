const {
  commonKeyboardTemplate,
} = require('../../templates/commonTemplates');

const {
  getAllByTelegramId,
} = require('../../services/location.service');

const addLocationNamesToKeyboard = async (telegramId) => {
  const result = await getAllByTelegramId({ telegramId });
  if (!result.succeeded) throw Error(result.message);
  const locations = result.model || [];

  const addLocationNamesKeyboardTemplate = locations.map(({ localName }) => [localName]).sort();
  const cache = {};
  locations.forEach((location) => {
    cache[location.localName] = location.id;
  });

  return {
    keyboard: [
      ...addLocationNamesKeyboardTemplate,
      ...commonKeyboardTemplate,
    ],
    cache,
  };
};

module.exports = addLocationNamesToKeyboard;
