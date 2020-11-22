const { models: { User } } = require('../../database');
// eslint-disable-next-line global-require,import/no-dynamic-require,max-len
// тут юзер не працює бо: оскільки в нас міграції
// і в індекс файл прописані службові дані
// ми не можемо доступитися до самої моделі юзера

const {
  enums,
  telegram,
  parser,
  db: {
    saveUser,
  },
} = require('../../helpers');

const getDataFromQuery = (query) => query.split('_').pop();

module.exports = async ({ data: callbackData, message }) => {
  if (callbackData.startsWith(enums.PREFIXES.SET_LANGUAGE)) {
    const userLang = getDataFromQuery(callbackData)
      .toLowerCase();

    await saveUser(message, userLang);

    return [
      telegram.hideInlineKeyboard(message.message_id),
      telegram.pause(200),
      telegram.sendText(enums.greeting, userLang),
    ];
  }

  const user = await User.get(message.chat.id);
  const userLang = user.language;

  switch (true) {
    case callbackData === enums.PREFIXES.GET_STARTED: {
      const keyboard = await parser.getCompetitionCountries();
      const greeting = enums.greeting(keyboard);

      return [
        telegram.hideInlineKeyboard(message.message_id),
        telegram.pause(200),
        telegram.sendText(greeting, userLang),
      ];
    }
    case callbackData.startsWith(enums.PREFIXES.CHOOSE_CATEGORY): {
      const countryCode = getDataFromQuery(callbackData);
      const countryName = utils.formatCountryName(countryCode);
      const keyboard = await parser.getCompetitionsKeyboard(countryCode);
      const category = enums.category(keyboard);

      return [
        telegram.hideInlineKeyboard(message.message_id),
        telegram.pause(200),
        telegram.sendText(category, userLang, enums.backButton(enums.PREFIXES.GET_STARTED)),
      ];
    }
    case callbackData.startsWith(enums.PREFIXES.ANNOUNCEMENT): {
      const announcementId = getDataFromQuery(callbackData);
      console.log(announcementId);

      return [
        telegram.hideInlineKeyboard(message.message_id),
        telegram.pause(200),
        telegram.sendText(enums.description, userLang),
      ];
    }
    case callbackData.startsWith(enums.PREFIXES.DESCRIPTION): {
      const competitionId = getDataFromQuery(callbackData);
      console.log(competitionId);

      return [
        telegram.hideInlineKeyboard(message.message_id),
        telegram.pause(200),
        telegram.sendText(enums.userRole, userLang),
      ];
    }
  }
};
