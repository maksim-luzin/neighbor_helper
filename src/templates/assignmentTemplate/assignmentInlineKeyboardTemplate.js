const ownAssignmentInlineKeyboardTemplate = ({ assignmentId, status }) => {
  const visibilityEvent = (status === 'done')
    ? { text: 'Отметить как невыполненное', callback_data: `markAssignmentAsNotCompletedAction.${assignmentId}` }
    : { text: 'Отметить как выполненное', callback_data: `markAssignmentAsCompletedAction.${assignmentId}` };

  return [
    [visibilityEvent],
    [{ text: 'Редактировать', callback_data: 'editAssignmentAction' }],
    [{ text: 'Удалить', callback_data: 'removeAssignmentAction' }],
  ];
};

const publicAssignmentInlineKeyboardTemplate = ({
  isFavorite,
  assignmentId,
  fromFavorites = false,
}) => {
  const favoriteEvent = isFavorite
    ? {
      text: 'Убрать из избранных',
      callback_data: `removeFromFavoritesAction.${assignmentId}.${fromFavorites}`,
    }
    : { text: 'В избранные', callback_data: `addToFavoritesAction.${assignmentId}` };

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
