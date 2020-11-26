const { defaultKey, defaultMessage } = require('../templates/defaultMessage');
const { templateResponse } = require('../middlewares');

const messageDefault = templateResponse(defaultKey, defaultMessage);

module.exports = messageDefault;
