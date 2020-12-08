const assignmentMessageTemplate = ({
  title,
  description,
  reward,
  locationName,
}) => {
  // eslint-disable-next-line no-param-reassign
  reward = reward || '';
  return `${title}\n\n${description}\n\nНаграда: ${reward}\nЛокация: ${locationName}`;
};

module.exports = assignmentMessageTemplate;
