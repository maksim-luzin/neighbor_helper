const botBuilder = require('claudia-bot-builder');
const messageHandler = require('./features');

const bot = botBuilder(async (request) => {
  const response = await messageHandler(request);
  return response;
}, {
  platforms: ['telegram'],
});

module.exports = bot;
