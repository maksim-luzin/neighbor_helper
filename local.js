/* eslint-disable import/no-extraneous-dependencies */
const ngrok = require('ngrok');
const axios = require('axios');
const express = require('express');
const parser = require('claudia-bot-builder/lib/telegram/parse');
const responder = require('claudia-bot-builder/lib/telegram/reply');

const config = require('./src/configs/global.config');
const sequelize = require('./src/database/connection/localConnection');

const handlers = require('./src/features');

const port = 3000;
const webhookPath = '/webhook';
const token = config.TELEGRAM_TOKEN;

if (!token) {
  throw new Error("Cann't find TELEGRAM_TOKEN in your environments");
}

sequelize
  .authenticate()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', err);
  });

// eslint-disable-next-line func-names
const telegramConnect = async () => {
  try {
    const url = await ngrok.connect(port);
    await axios({
      method: 'GET',
      url: `https://api.telegram.org/bot${token}/setWebhook?url=${url}${webhookPath}`,
    });
  } catch (err) {
    throw new Error(`Cann't setup webhook, reason: ${err.message}`);
  }
};

telegramConnect();

const app = express();

app.use(express.json());

app.post(webhookPath, async (req, res) => {
  const parsedMessage = parser(req.body);
  const botResponse = await handlers(parsedMessage);

  try {
    if (botResponse) {
      await responder(parsedMessage, botResponse, token);
    }
  } catch (e) {
    console.log(e);
  }
  res.sendStatus(200);
});

app.listen(port, () => process.stdout.write(`Server started at port ${port}\n`));
