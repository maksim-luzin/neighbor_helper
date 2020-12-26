const assignmentMessageTemplate = ({
  title,
  description,
  reward,
  locationName,
  authorTelegramId,
}) => {
  // eslint-disable-next-line no-param-reassign
  reward = reward || '';
  return `${title}\n\n${description}\n\nНаграда: ${reward}\nЛокация: ${locationName}\n[Автор](tg://user?id=${authorTelegramId})`;
};

module.exports = assignmentMessageTemplate;
