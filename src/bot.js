const botBuilder = require('claudia-bot-builder');
const messageHandler = require('./features');

// TODO botBuilder(messageHandler, ...);
const bot = botBuilder(messageHandler,
  {
    platforms: ['telegram'],
  });

module.exports = bot;
