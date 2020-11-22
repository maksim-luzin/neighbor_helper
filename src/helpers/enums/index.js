const PREFIXES = {
  SET_LANGUAGE: 'SET_LANGUAGE_',
  GET_STARTED: 'GET_STARTED_',
  ANNOUNCEMENT: 'ANNOUNCEMENT_',
  CHOOSE_CATEGORY: 'CHOOSE_CATEGORY_',
  DESCRIPTION: 'DESCRIPTION_',
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
    keyboard: [[
      ['Редагувати радіус'],
      ['Додати локацію'],
      ['Мої оголошення'],
      ['Розмістити оголошення'],
      [''],
      [''],
      [''],
      [''],
    ]],
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

module.exports.category = (keyboard) => ({
  keyboard,
  keyboardPrefix: PREFIXES.CHOOSE_CATEGORY,
  ua: {
    text: 'Оберіть категорію оголошення',
  },
});

module.exports.announcement = (keyboard, category) => ({
  keyboard,
  keyboardPrefix: PREFIXES.ANNOUNCEMENT,
  ua: {
    text: `Введіть назву оголошення.\nКатегорія - ${category}`,
  },
});

module.exports.userRole = {
  keyboardPrefix: 'CHOOSE_USER_ROLE_',
  ua: {
    text: 'Представтеся, будь ласка.',
    keyboard: [[['Я NG-H делегат/організатор', 'ADMIN']], [['Я - учасник/гість', 'SIMPLE']]],
  },
};
