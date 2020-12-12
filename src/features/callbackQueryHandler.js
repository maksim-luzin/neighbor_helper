const {
  changeRangeAction,
  mainMenuAction,
} = require('../actions/mainActions');

const { paginationAction } = require('../actions/commonActions');
const {
  removeFromFavoritesAction,
  addToFavoritesAction,
} = require('../actions/assignmentActions');

const { deleteMessage } = require('../helpers/telegram');

const callbackQueryHandler = async (callbackQuery, state) => {
  let response;
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

    case 'addToFavoritesAction':
      response = await addToFavoritesAction(callbackQuery, splitCallbackQueryData[1]);
      return response;

    default:
      return mainMenuAction();
  }
};

module.exports = callbackQueryHandler;
