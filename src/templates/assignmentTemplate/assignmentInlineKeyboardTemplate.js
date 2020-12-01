const ownAssignmentInlineKeyboardTemplate = (status) => {
  const visibilityEvent = (status === 'done')
    ? { text: 'Отметить как невыполненное', callback_data: 'markAssignmentAsNotCompletedAction' }
    : { text: 'Отметить как выполненное', callback_data: 'markAssignmentAsCompletedAction' };

  return [
    [visibilityEvent],
    [{ text: 'Редактировать', callback_data: 'editAssignmentAction' }],
    [{ text: 'Удалить', callback_data: 'removeAssignmentAction' }],
  ];
};

const publicAssignmentInlineKeyboardTemplate = ({ isFavorite }) => {
  const favoriteEvent = isFavorite
    ? { text: 'Убрать из избранных', callback_data: 'removeFromFavoritesAction' }
    : { text: 'В избранные', callback_data: 'addToFavoritesAction' };

  return [
    [{ text: 'Связаться с автором', callback_data: 'contactTheAuthorAction' }],
    [
      favoriteEvent,
      { text: 'Spam', callback_data: 'markAsSpamAction' },
    ],
  ];
};

module.exports = {
  ownAssignmentInlineKeyboardTemplate,
  publicAssignmentInlineKeyboardTemplate,
};
