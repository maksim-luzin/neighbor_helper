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
} = require('../actions/assignmentActions');

const { addMenuSelectCategoryForEditAssignmentAction } = require('../actions/editAssignmentAction');

const { deleteMessage } = require('../helpers/telegram');

const callbackQueryHandler = async (callbackQuery, state) => {
  // TODO aray destructuring
  const splitCallbackQueryData = callbackQuery.data.split('.');
  switch (splitCallbackQueryData[0]) {
    case 'changeRangeAction':
      return await changeRangeAction(callbackQuery);

    case 'paginationAction':
      // eslint-disable-next-line no-case-declarations
      const response = await paginationAction(callbackQuery, +splitCallbackQueryData[1], state);
      return response.concat(await deleteMessage(callbackQuery));

    case 'removeFromFavoritesAction':
      return await removeFromFavoritesAction(
        {
          request: callbackQuery,
          assignmentId: splitCallbackQueryData[1],
          fromFavorites: splitCallbackQueryData[2],
        },
      );

    case 'markAssignmentAsNotCompletedAction':
      return await markAssignmentAsNotCompletedAction({
        request: callbackQuery,
        assignmentId: splitCallbackQueryData[1],
      });

    case 'markAssignmentAsCompletedAction':
      return await markAssignmentAsCompletedAction({
        request: callbackQuery,
        assignmentId: splitCallbackQueryData[1],
      });

    case 'addToFavoritesAction':
      return await addToFavoritesAction(callbackQuery, splitCallbackQueryData[1]);

    case 'markAssignmentAsSpamAction':
      return markAssignmentAsSpamAction(callbackQuery, splitCallbackQueryData[1]);

    case 'confirmAssignmentAsSpamAction':
      return await confirmAssignmentAsSpamAction(callbackQuery, splitCallbackQueryData[1]);

    case 'backFromConfirmAssignmentAsSpamAction':
      return await backFromConfirmAssignmentAsSpamAction(
        callbackQuery,
        splitCallbackQueryData[1],
      );

    case 'removeAssignmentAction':
      return await removeAssignmentAction(callbackQuery, splitCallbackQueryData[1]);

    case 'editAssignmentAction':
      // eslint-disable-next-line no-case-declarations
      const { message } = callbackQuery;
      return await addMenuSelectCategoryForEditAssignmentAction(
        message,
        null,
        splitCallbackQueryData[1],
      );

    default:
      return mainMenuAction();
  }
};

module.exports = callbackQueryHandler;
