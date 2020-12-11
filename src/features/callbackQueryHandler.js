const {
  changeRangeAction,
  mainMenuAction,
} = require('../actions/mainActions');

const { paginationAction } = require('../actions/commonActions');

const callbackQueryHandler = async (callbackQuery, state) => {
  let response;
  switch (callbackQuery.data.split('.')[0]) {
    case 'changeRangeAction':
      response = await changeRangeAction(callbackQuery);
      return response;

    case 'paginationAction':
      response = await paginationAction(callbackQuery, +callbackQuery.data.split('.')[1], state);
      return response;

    default:
      return mainMenuAction();
  }
};

module.exports = callbackQueryHandler;
