const { defaultMessageTemplate } = require('../templates/defaultMessageTemplate');
const { mainMenuTemplate } = require('../templates/mainMenuTemplate');
const { templateResponse } = require('../middlewares');

const messageDefaultAction = () => templateResponse(defaultMessageTemplate, mainMenuTemplate);

module.exports = {
  messageDefaultAction,
};
