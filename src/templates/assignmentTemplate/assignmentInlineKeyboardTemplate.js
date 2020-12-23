const ownAssignmentInlineKeyboardTemplate = ({ assignmentId, status }) => {
  const visibilityEvent = (status === 'done')
    ? { text: 'Отметить как невыполненное', callback_data: `markAssignmentAsNotCompletedAction.${assignmentId}` }
    : { text: 'Отметить как выполненное', callback_data: `markAssignmentAsCompletedAction.${assignmentId}` };

  return [
    [visibilityEvent],
    [{ text: 'Редактировать', callback_data: `editAssignmentAction.${assignmentId}` }],
    [{ text: 'Удалить', callback_data: `removeAssignmentAction.${assignmentId}` }],
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
    [
      favoriteEvent,
      { text: 'Spam', callback_data: `markAssignmentAsSpamAction.${assignmentId}` },
    ],
  ];
};

module.exports = {
  ownAssignmentInlineKeyboardTemplate,
  publicAssignmentInlineKeyboardTemplate,
};
