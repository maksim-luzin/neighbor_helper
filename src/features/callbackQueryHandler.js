const {
  changeRangeAction,
} = require('../actions/mainActions');

const {
  mainMenuAction,
} = require('../actions/mainActions');

const callbackQueryHandler = async (callbackQuery) => {
  let response;
  switch (callbackQuery.data) {
    case 'changeRangeAction.+':
    case 'changeRangeAction.-':
      response = await changeRangeAction(callbackQuery);
      return response;

    default:
      return mainMenuAction();
  }
};

module.exports = callbackQueryHandler;
