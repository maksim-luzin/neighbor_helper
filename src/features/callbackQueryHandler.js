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
} = require('../actions/assignmentActions');

const { deleteMessage } = require('../helpers/telegram');

const callbackQueryHandler = async (callbackQuery, state) => {
  let response;
  const [action, index, fromFavorites] = callbackQuery.data.split('.');
  switch (action) {
    case 'changeRangeAction':
      return await changeRangeAction(callbackQuery);

    case 'paginationAction':
      response = await paginationAction(callbackQuery, +index, state);
      return response.concat(await deleteMessage(callbackQuery));

    case 'removeFromFavoritesAction':
      return await removeFromFavoritesAction(
        {
          request: callbackQuery,
          assignmentId: index,
          fromFavorites,
        },
      );

    case 'markAssignmentAsNotCompletedAction':
      return await markAssignmentAsNotCompletedAction({
        request: callbackQuery,
        assignmentId: index,
      });

    case 'markAssignmentAsCompletedAction':
      return await markAssignmentAsCompletedAction({
        request: callbackQuery,
        assignmentId: index,
      });

    case 'addToFavoritesAction':
      return await addToFavoritesAction(callbackQuery, index);

    case 'markAssignmentAsSpamAction':
      return markAssignmentAsSpamAction(callbackQuery, index);

    case 'confirmAssignmentAsSpamAction':
      return await confirmAssignmentAsSpamAction(callbackQuery, index);

    case 'backFromConfirmAssignmentAsSpamAction':
      return await backFromConfirmAssignmentAsSpamAction(
        callbackQuery,
        index,
      );

    case 'removeAssignmentAction':
      return await removeAssignmentAction(callbackQuery, index);

    default:
      return mainMenuAction();
  }
};

module.exports = callbackQueryHandler;
