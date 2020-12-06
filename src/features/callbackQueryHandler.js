const {
  mainMenuAction,
  goBackAction,
} = require('../actions/mainActions');

const {
  chooseAssignmentCategoryAction,
  chooseAssignmentLocationAction,
} = require('../actions/assignmentActions');

const {
  changeRangeNumberAction,
} = require('../actions/rangeActions');

const callbackQueryHandler = async (callbackQuery) => {
  let response;
  switch (callbackQuery.data.split('.')[0]) {
    case 'changeRangeAction':
      response = await changeRangeNumberAction(callbackQuery);
      return response;

    case 'chooseAssignmentCategoryAction':
      response = await chooseAssignmentCategoryAction(callbackQuery);
      return response;

    case 'chooseAssignmentLocationAction':
      response = await chooseAssignmentLocationAction(callbackQuery);
      return response;

    case 'goBackAction':
      response = await goBackAction(callbackQuery);
      return response;

    default:
      return mainMenuAction();
  }
};

module.exports = callbackQueryHandler;
