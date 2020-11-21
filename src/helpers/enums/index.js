const PREFIXES = {
  SET_LANGUAGE: 'SET_LANGUAGE_',
  GET_STARTED: 'GET_STARTED_',
  CHOOSE_COMPETITION_COUNTRY: 'CHOOSE_COMPETITION_COUNTRY_',
  COMPETITION: 'COMPETITION_',
};

module.exports.backButton = (callback) => ({
  keyboardPrefix: callback,
  ua: '<< Назад',
  us: '<< Back',
  ru: '<< Назад',
});

module.exports.start = {
  keyboardPrefix: PREFIXES.SET_LANGUAGE,
  text: 'Before we start, choose a language to communicate with me',
  keyboard: [[['Українська', 'UA'], [' Русский', 'RU'], ['English', 'US']]],
};

module.exports.greeting = {
  keyboardPrefix: PREFIXES.GET_STARTED,
  ua: {
    text: 'Привіт, я neighbor_helper бот! Я створений, щоб допомагати сусідам.',
    keyboard: [[['Редагувати радіус'], ['Додати локацію'], ['Мої оголошення'], [''], [''], [''], [''], ['']]],
  },
  ru: {
    text: '',
    keyboard: [[[]]],
  },
  us: {
    text: '',
    keyboard: [[[]]],
  },
};

module.exports.competitionCountries = (keyboard) => ({
  keyboard,
  keyboardPrefix: PREFIXES.CHOOSE_COMPETITION_COUNTRY,
  ua: {
    text: 'Оберіть країну ваших змагань',
  },
});

module.exports.competitions = (keyboard, countryName) => ({
  keyboard,
  keyboardPrefix: PREFIXES.COMPETITION,
  ua: {
    text: `Оберіть змагання, яке вас цікавить.\nКраїна - ${countryName}`,
  },
});

module.exports.userRole = {
  keyboardPrefix: 'CHOOSE_USER_ROLE_',
  ua: {
    text: 'Представтеся, будь ласка.',
    keyboard: [[['Я - WCA делегат/організатор', 'ADMIN']], [['Я - учасник/гість', 'SIMPLE']]],
  },
};
