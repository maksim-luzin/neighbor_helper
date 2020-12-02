const {
  BUTTON_BARTER,
  BUTTON_EDUCATION,
  BUTTON_HELP,
  BUTTON_REPAIR,
} = require('../../constants/button.text').CATEGORY;

const {
  BUTTON_SKIP,
} = require('../../constants/button.text').COMMON;

const chooseCategoryKeyboardTemplate = [
  [
    {
      text: BUTTON_REPAIR,
      callback_data: 'chooseAssignmentCategoryAction.repair',
    },
    {
      text: BUTTON_EDUCATION,
      callback_data: 'chooseAssignmentCategoryAction.education',
    },
  ],
  [
    {
      text: BUTTON_HELP,
      callback_data: 'chooseAssignmentCategoryAction.help',
    },
    {
      text: BUTTON_BARTER,
      callback_data: 'chooseAssignmentCategoryAction.barter',
    },
  ],
  [
    {
      text: BUTTON_SKIP,
      callback_data: 'chooseAssignmentCategoryAction.other',
    },
  ],
];

module.exports = chooseCategoryKeyboardTemplate;
