/* eslint-disable no-return-await */
const {
  changeRangeAction,
  mainMenuAction,
} = require('../actions/mainActions');

const { paginationAction } = require('../actions/commonActions');
const {
  removeFromFavoritesAction,
  addToFavoritesAction,
  markAssignmentAsSpamAction,
  confirmAssignmentAsSpamAction,
  backFromConfirmAssignmentAsSpamAction,
  removeAssignmentAction,
  markAssignmentAsNotCompletedAction,
  markAssignmentAsCompletedAction,
  backFromConfirmAssignmentRemoveAction,
  confirmAssignmentRemoveAction,
} = require('../actions/assignmentActions');

const { addMenuSelectCategoryForEditAssignmentAction } = require('../actions/editAssignmentAction');

const {
  ASSIGNMENT_ACTIONS,
  COMMON_ACTIONS,
  RANGE_ACTIONS,
} = require('../constants/actions');

const { deleteMessage } = require('../helpers/telegram');

const callbackQueryHandler = async (callbackQuery, state) => {
  let response;
  const [action, index, fromFavorites] = callbackQuery.data.split('.');
  switch (action) {
    case RANGE_ACTIONS.CHANGE_RANGE:
      return changeRangeAction(callbackQuery);

      // TODO: убрать единственный await в этом методе. После чего убрать async.
    case COMMON_ACTIONS.PAGINATION:
      response = await paginationAction(callbackQuery, +index, state);
      return response.concat(deleteMessage(callbackQuery));

    case ASSIGNMENT_ACTIONS.REMOVE_FROM_FAVORITES:
      return removeFromFavoritesAction(
        {
          request: callbackQuery,
          assignmentId: index,
          fromFavorites,
        },
      );

    case ASSIGNMENT_ACTIONS.ADD_TO_FAVORITES:
      return addToFavoritesAction(callbackQuery, index);

    case ASSIGNMENT_ACTIONS.MARK_ASSIGNMENT_AS_NOT_COMPLETED:
      return markAssignmentAsNotCompletedAction({
        request: callbackQuery,
        assignmentId: index,
      });

    case ASSIGNMENT_ACTIONS.MARK_ASSIGNMENT_AS_COMPLETED:
      return markAssignmentAsCompletedAction({
        request: callbackQuery,
        assignmentId: index,
      });

    case ASSIGNMENT_ACTIONS.MARK_ASSIGNMENT_AS_SPAM:
      return markAssignmentAsSpamAction(callbackQuery, index);

    case ASSIGNMENT_ACTIONS.CONFIRM_ASSIGNMENT_AS_SPAM:
      return confirmAssignmentAsSpamAction(callbackQuery, index);

    case ASSIGNMENT_ACTIONS.BACK_FROM_CONFIRM_ASSIGNMENT_AS_SPAM:
      return backFromConfirmAssignmentAsSpamAction(callbackQuery, index);

    case ASSIGNMENT_ACTIONS.REMOVE_ASSIGNMENT:
      return removeAssignmentAction(callbackQuery, index);

    case ASSIGNMENT_ACTIONS.CONFIRM_ASSIGNMENT_REMOVE:
      return confirmAssignmentRemoveAction(callbackQuery, index);

    case ASSIGNMENT_ACTIONS.BACK_FROM_CONFIRM_ASSIGNMENT_REMOVE:
      return backFromConfirmAssignmentRemoveAction(callbackQuery, index);

    case ASSIGNMENT_ACTIONS.EDIT_ASSIGNMENT:
      // eslint-disable-next-line no-case-declarations
      const { message } = callbackQuery;
      return addMenuSelectCategoryForEditAssignmentAction(
        message,
        null,
        index,
      );

    default:
      return mainMenuAction();
  }
};

module.exports = callbackQueryHandler;
