const botBuilder = require('claudia-bot-builder');
const messageHandler = require('./features');

const bot = botBuilder(messageHandler, {
  platforms: ['telegram'],
});

module.exports = bot;
