const { telegramTemplate } = require('claudia-bot-builder');
const {
  asignmentTextTemplate,
  ownAssignmentInlineKeyboardTemplate,
  publicAssignmentInlineKeyboardTemplate,
} = require('../templates/assignmentTemplate');

const favoriteAssignmentsAction = () => (
  new telegramTemplate
    .Photo(
      'https://claudiajs.com/assets/claudiajs.png',
      asignmentTextTemplate({
        title: 'Требуеться помощь по ремонту',
        description: 'Прошу помочь с установкой межкомнатной двери',
        reward: null,
        authorTelegramId: '123',
        pictureUrl: 'https://claudiajs.com/assets/claudiajs.png',
        locationName: 'Дом',
      }),
    ).addInlineKeyboard(publicAssignmentInlineKeyboardTemplate({ isFavorite: false }))
    .get()
);

const ownAssignmentsAction = () => (
  new telegramTemplate
    .Photo(
      'https://claudiajs.com/assets/claudiajs.png',
      asignmentTextTemplate({
        title: 'Требуеться помощь по ремонту',
        description: 'Прошу помочь с установкой межкомнатной двери',
        reward: null,
        authorTelegramId: '123',
        pictureUrl: 'https://claudiajs.com/assets/claudiajs.png',
        locationName: 'Дом',
      }),
    ).addInlineKeyboard(ownAssignmentInlineKeyboardTemplate('done'))
    .get()
);

module.exports = {
  favoriteAssignmentsAction,
  ownAssignmentsAction,
};
