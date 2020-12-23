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

const { deleteMessage } = require('../helpers/telegram');

const callbackQueryHandler = async (callbackQuery, state) => {
  let response;
  const [action, index, fromFavorites] = callbackQuery.data.split('.');
  switch (action) {
    case 'changeRangeAction':
      return changeRangeAction(callbackQuery);

      // TODO: убрать единственный await в этом методе. После чего убрать async.
    case 'paginationAction':
      response = await paginationAction(callbackQuery, +index, state);
      return response.concat(deleteMessage(callbackQuery));

    case 'removeFromFavoritesAction':
      return removeFromFavoritesAction(
        {
          request: callbackQuery,
          assignmentId: index,
          fromFavorites,
        },
      );

    case 'markAssignmentAsNotCompletedAction':
      return markAssignmentAsNotCompletedAction({
        request: callbackQuery,
        assignmentId: index,
      });

    case 'markAssignmentAsCompletedAction':
      return markAssignmentAsCompletedAction({
        request: callbackQuery,
        assignmentId: index,
      });

    case 'addToFavoritesAction':
      return addToFavoritesAction(callbackQuery, index);

    case 'markAssignmentAsSpamAction':
      return markAssignmentAsSpamAction(callbackQuery, index);

    case 'confirmAssignmentAsSpamAction':
      return confirmAssignmentAsSpamAction(callbackQuery, index);

    case 'backFromConfirmAssignmentAsSpamAction':
      return backFromConfirmAssignmentAsSpamAction(callbackQuery, index);

    case 'removeAssignmentAction':
      return removeAssignmentAction(callbackQuery, index);

    case 'confirmAssignmentRemoveAction':
      return confirmAssignmentRemoveAction(callbackQuery, index);

    case 'backFromConfirmAssignmentRemoveAction':
      return backFromConfirmAssignmentRemoveAction(callbackQuery, index);

    case 'editAssignmentAction':
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
