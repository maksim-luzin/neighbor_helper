const { assignmentCategory } = require('../../constants/enums');

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
  if (reward) assignment += `\`Награда: ${reward}\`\n`;
  // eslint-disable-next-line no-use-before-define
  if (category) assignment += `\`Категория: ${categoryNameForShowAssignment(category)}\`\n`;
  if (localLocationName) assignment += `\`Локация: ${localLocationName}\`\n`;
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
