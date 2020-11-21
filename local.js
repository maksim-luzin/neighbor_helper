/* eslint-disable import/no-extraneous-dependencies */
const ngrok = require('ngrok');
const Axios = require('axios');
const express = require('express');
const parser = require('claudia-bot-builder/lib/telegram/parse');
const responder = require('claudia-bot-builder/lib/telegram/reply');

const messageHandler = require('./src/features');
const {
  global: {
    BOT_TOKEN,
    PORT,
  },
} = require('./src/configs');
const { ErrorHandler } = require('./src/errors');

(async () => {
  try {
    const port = 3000;
    const webhookPath = '/webhook';
    const token = BOT_TOKEN;

    if (!token) {
      return new ErrorHandler('Can\'t find TEST_BOT_TOKEN in your environments');
    }

    try {
      const url = await ngrok.connect(port);

      await Axios({
        method: 'GET',
        url: `https://api.telegram.org/bot${token}/setWebhook?url=${url}${webhookPath}`,
      });
    } catch (err) {
      return new ErrorHandler(`Can't setup webhook, reason: ${err.message}`);
    }

    const app = express();

    app.use(express.json());

    app.post(webhookPath, async (req, res) => {
      const parsedMessage = parser(req.body);
      const botResponse = await messageHandler(parsedMessage);

      responder(parsedMessage, botResponse, token);

      res.sendStatus(200);
    });

    app.listen(PORT, () => process.stdout.write(`Server started at port ${PORT}\n`));
  } catch (err) {
    process.stdout.write(`${err.message}\n`);
  }
})();
