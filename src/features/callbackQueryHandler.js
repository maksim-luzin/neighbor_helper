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
  //TODO aray destructuring
  const splitCallbackQueryData = callbackQuery.data.split('.');
  switch (splitCallbackQueryData[0]) {
    case 'changeRangeAction':
      response = await changeRangeAction(callbackQuery);
      return response;

    case 'paginationAction':
      response = await paginationAction(callbackQuery, +splitCallbackQueryData[1], state);
      return response.concat(await deleteMessage(callbackQuery));

    case 'removeFromFavoritesAction':
      response = await removeFromFavoritesAction(
        {
          request: callbackQuery,
          assignmentId: splitCallbackQueryData[1],
          fromFavorites: splitCallbackQueryData[2],
        },
      );
      return response;

    case 'markAssignmentAsNotCompletedAction':
      response = await markAssignmentAsNotCompletedAction({
        request: callbackQuery,
        assignmentId: splitCallbackQueryData[1],
      });

      return response;

    case 'markAssignmentAsCompletedAction':
      response = await markAssignmentAsCompletedAction({
        request: callbackQuery,
        assignmentId: splitCallbackQueryData[1],
      });

      return response;

    case 'addToFavoritesAction':
      response = await addToFavoritesAction(callbackQuery, splitCallbackQueryData[1]);
      return response;

    case 'markAssignmentAsSpamAction':
      response = markAssignmentAsSpamAction(callbackQuery, splitCallbackQueryData[1]);
      return response;

    case 'confirmAssignmentAsSpamAction':
      response = await confirmAssignmentAsSpamAction(callbackQuery, splitCallbackQueryData[1]);
      return response;

    case 'backFromConfirmAssignmentAsSpamAction':
      response = await backFromConfirmAssignmentAsSpamAction(
        callbackQuery,
        splitCallbackQueryData[1],
      );
      return response;

    case 'removeAssignmentAction':
      response = await removeAssignmentAction(callbackQuery, splitCallbackQueryData[1]);
      return response;

    default:
      return mainMenuAction();
  }
};

module.exports = callbackQueryHandler;
