const i18n = require('../../helpers/localization');

const {
  ASSIGNMENT_ACTIONS,
} = require('../../constants/actions');

const ownAssignmentInlineKeyboardTemplate = ({ assignmentId, status }) => {
  const visibilityEvent = (status === 'done')
    ? { text: i18n.t('assignment.button.markAssignmentAsNotCompleted'), callback_data: `${ASSIGNMENT_ACTIONS.MARK_ASSIGNMENT_AS_NOT_COMPLETED}.${assignmentId}` }
    : { text: i18n.t('assignment.button.markAssignmentAsCompleted'), callback_data: `${ASSIGNMENT_ACTIONS.MARK_ASSIGNMENT_AS_COMPLETED}.${assignmentId}` };

  return [
    [visibilityEvent],
    [{ text: i18n.t('assignment.button.editAssignment'), callback_data: `${ASSIGNMENT_ACTIONS.EDIT_ASSIGNMENT}.${assignmentId}` }],
    [{ text: i18n.t('assignment.button.removeAssignment'), callback_data: `${ASSIGNMENT_ACTIONS.REMOVE_ASSIGNMENT}.${assignmentId}` }],
  ];
};

const publicAssignmentInlineKeyboardTemplate = ({
  isFavorite,
  assignmentId,
  fromFavorites = false,
}) => {
  const favoriteEvent = isFavorite
    ? {
      text: i18n.t('assignment.button.removeFromFavorites'),
      callback_data: `${ASSIGNMENT_ACTIONS.REMOVE_FROM_FAVORITES}.${assignmentId}.${fromFavorites}`,
    }
    : { text: i18n.t('assignment.button.addToFavorites'), callback_data: `${ASSIGNMENT_ACTIONS.ADD_TO_FAVORITES}.${assignmentId}` };

  return [
    [
      favoriteEvent,
      { text: i18n.t('assignment.button.markAsSpam'), callback_data: `${ASSIGNMENT_ACTIONS.MARK_ASSIGNMENT_AS_SPAM}.${assignmentId}` },
    ],
  ];
};

module.exports = {
  ownAssignmentInlineKeyboardTemplate,
  publicAssignmentInlineKeyboardTemplate,
};
