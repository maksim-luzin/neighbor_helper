const {
  BUTTON_BARTER,
  BUTTON_EDUCATION,
  BUTTON_HELP,
  BUTTON_REPAIR,
  BUTTON_OTHER,
} = require('../button.text').CATEGORY;

const assignmentCategory = {
  [BUTTON_BARTER]: 'barter',
  [BUTTON_EDUCATION]: 'education',
  [BUTTON_HELP]: 'help',
  [BUTTON_REPAIR]: 'repair',
  [BUTTON_OTHER]: 'other',
};

module.exports = assignmentCategory;
