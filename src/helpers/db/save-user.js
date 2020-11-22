const { models: { User } } = require('../../database');

module.exports = async (message, language) => {
  const telegramId = message.chat.id;

  const user = User.get(telegramId);

  if (user) {
    return User.update(telegramId, { language });
  }

  const newUser = new User({
    language,
    telegramId: message.chat.id,
    score: message.chat.score,
    range: message.chat.range || '',
    locale: message.chat.locale,
  });

  return newUser.save();
};
