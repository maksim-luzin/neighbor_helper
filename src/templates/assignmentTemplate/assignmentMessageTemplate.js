const assignmentMessageTemplate = ({
  title,
  description,
  reward,
  locationName,
  authorUsername,
  authorTelegramId,
}) => {
  // eslint-disable-next-line no-param-reassign
  reward = reward || '';
  return `${title}\n\n${description}\n\nНаграда: ${reward}\nЛокация: ${locationName}\nАвтор: @[${authorUsername}](tg://user?id=${authorTelegramId})`;
};

module.exports = assignmentMessageTemplate;
