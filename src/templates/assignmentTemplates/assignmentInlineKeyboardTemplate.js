const {
  ASSIGNMENT_ACTIONS,
} = require('../../constants/actions');

const ownAssignmentInlineKeyboardTemplate = ({ assignmentId, status }) => {
  const visibilityEvent = (status === 'done')
    ? { text: 'Отметить как невыполненное', callback_data: `${ASSIGNMENT_ACTIONS.MARK_ASSIGNMENT_AS_NOT_COMPLETED}.${assignmentId}` }
    : { text: 'Отметить как выполненное', callback_data: `${ASSIGNMENT_ACTIONS.MARK_ASSIGNMENT_AS_COMPLETED}.${assignmentId}` };

  return [
    [visibilityEvent],
    [{ text: 'Редактировать', callback_data: `${ASSIGNMENT_ACTIONS.EDIT_ASSIGNMENT}.${assignmentId}` }],
    [{ text: 'Удалить', callback_data: `${ASSIGNMENT_ACTIONS.REMOVE_ASSIGNMENT}.${assignmentId}` }],
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
      callback_data: `${ASSIGNMENT_ACTIONS.REMOVE_FROM_FAVORITES}.${assignmentId}.${fromFavorites}`,
    }
    : { text: 'В избранные', callback_data: `${ASSIGNMENT_ACTIONS.ADD_TO_FAVORITES}.${assignmentId}` };

  return [
    [
      favoriteEvent,
      { text: 'Spam', callback_data: `${ASSIGNMENT_ACTIONS.MARK_ASSIGNMENT_AS_SPAM}.${assignmentId}` },
    ],
  ];
};

module.exports = {
  ownAssignmentInlineKeyboardTemplate,
  publicAssignmentInlineKeyboardTemplate,
};
