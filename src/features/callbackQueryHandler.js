const {
  changeRangeAction,
} = require('../actions/mainActions');

const {
  mainMenuAction,
} = require('../actions/mainActions');

const { createdAssignmentsAction } = require('../actions/assignmentActions');

const callbackQueryHandler = async (callbackQuery) => {
  let response;
  switch (callbackQuery.data.split('.')[0]) {
    case 'changeRangeAction':
      response = await changeRangeAction(callbackQuery);
      return response;

    case 'paginationAction':
      response = await createdAssignmentsAction(callbackQuery, +callbackQuery.data.split('.')[1]);
      return response;

    default:
      return mainMenuAction();
  }
};

module.exports = callbackQueryHandler;
