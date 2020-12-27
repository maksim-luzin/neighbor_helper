const i18n = require('../../helpers/localization');

const assignmentMessageTemplate = ({
  title,
  description,
  reward,
  locationName,
  authorTelegramId,
}) => {
  // eslint-disable-next-line no-param-reassign
  reward = reward || '';
  return `${title}\n\n${description}\n\n${i18n.t('assignment.reward')}: ${reward}\n${i18n.t('assignment.location')}: ${locationName}\n[${i18n.t('assignment.author')}](tg://user?id=${authorTelegramId})`;
};

module.exports = assignmentMessageTemplate;
