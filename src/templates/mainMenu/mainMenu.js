const {
  COMMAND_START,
} = require('../../constants/comand');

const {
  BUTTON_MAIN_MENU_ABOUT_US,
  BUTTON_MAIN_MENU_ADD_LOCATION,
} = require('../../constants/comand');

const mainMenu = [
  ['Редактировать радиус'],
  [BUTTON_MAIN_MENU_ADD_LOCATION],
  ['Мои объявления'],
  ['Избранные объявления'],
  ['Подать объявление'],
  ['Найти объявление'],
  ['Язык', BUTTON_MAIN_MENU_ABOUT_US],
];

const mainMenuMessage = (message) => {
  if (message.text === COMMAND_START || message.text === BUTTON_MAIN_MENU_ABOUT_US) {
    return `Здравствуй ${message.from.first_name}.
    Я бот для организации взаимопомощи соседей.`;
  }

  return 'Главное меню';
};

exports.mainMenu = mainMenu;
exports.mainMenuMessage = mainMenuMessage;
