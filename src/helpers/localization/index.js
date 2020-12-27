const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const SyncBackend = require('i18next-fs-backend');

const i18n = i18next.createInstance();

i18n.use(Backend)
  .use(SyncBackend)
  .init({
    lng: 'en',
    // debug: true,
    fallbackLng: 'ru',
    preload: ['en', 'ru', 'ua'],
    backend: {
      loadPath: `${__dirname}/../../locales/{{lng}}/{{ns}}.json`,
    },
    initImmediate: false,
  });

module.exports = i18n;
