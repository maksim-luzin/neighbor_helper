const i18n = require('../../helpers/localization');

const greetingsMessageTemplate = (firstName) => i18n.t('messages.greeting', { firstName });

module.exports = greetingsMessageTemplate;
