const { assignmentCategory } = require('../../constants/enums');
const i18n = require('../localization');

const assignmentMessage = ({
  title = null,
  description = null,
  reward = null,
  category = null,
  localLocationName = null,
  pictureUrl = null,
}) => {
  let assignment = '';
  if (title) assignment += `*${title}*\n`;
  if (description) assignment += `${description}\n`;
  if (reward) assignment += `\`${i18n.t('assignment.reward')}: ${reward}\`\n`;
  // eslint-disable-next-line no-use-before-define
  if (category) assignment += `\`${i18n.t('assignment.category')}: ${categoryNameForShowAssignment(category)}\`\n`;
  if (localLocationName) assignment += `\`${i18n.t('assignment.location')}: ${localLocationName}\`\n`;
  return {
    assignment,
    pictureUrl,
  };
};

module.exports = assignmentMessage;

// eslint-disable-next-line consistent-return
function categoryNameForShowAssignment(category) {
  // eslint-disable-next-line no-restricted-syntax
  for (const elem in assignmentCategory) {
    if (assignmentCategory[elem] === category) return elem;
  }
}
