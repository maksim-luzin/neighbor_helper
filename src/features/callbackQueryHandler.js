const {
  mainMenuAction,
} = require('../actions/mainActions');

const {
  createdAssignmentsAction,
  removeFromFavoritesAction,
  addToFavoritesAction,
} = require('../actions/assignmentActions');

const callbackQueryHandler = async (callbackQuery) => {
  let response;
  const splitCallbackQueryData = callbackQuery.data.split('.');
  switch (splitCallbackQueryData[0]) {
    case 'paginationAction':
      response = await createdAssignmentsAction(callbackQuery, splitCallbackQueryData[1]);
      return response;

    case 'removeFromFavoritesAction':
      response = await removeFromFavoritesAction(
        {
          request: callbackQuery,
          assignmentId: splitCallbackQueryData[1],
          fromFavorites: splitCallbackQueryData[2],
        },
      );
      return response;

    case 'addToFavoritesAction':
      response = await addToFavoritesAction(callbackQuery, splitCallbackQueryData[1]);
      return response;

    default:
      return mainMenuAction();
  }
};

module.exports = callbackQueryHandler;
