import API from 'claudia-api-builder';
import excuse from 'huh';

const api = new API();

api.get('/', request => (
  `Thanks for sending ${request.text}.Your message is very important to us, but ${excuse.get()}`
));

module.exports = api;
