import botBuilder, { telegramTemplate } from 'claudia-bot-builder';

const mainMenu = [
  ['Добавить локацию'],
  ['Мои объявления'],
  ['Избранные объявления'],
  ['Подать объявление'],
  ['Найти объявление'],
  ['Язык', 'О нас']
];

const bot = botBuilder(() => (
  new telegramTemplate
    // eslint-disable-next-line new-cap
    .Text('Приветствую вас.')
    .addReplyKeyboard(mainMenu)
    .get()
));

module.exports = bot;
