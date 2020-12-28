const i18n = require('../../helpers/localization');

const rangeMessageTemplate = (range) => (i18n.t('range.currentRange', { range })
  + i18n.t('range.changeRangeMessage'));

module.exports = rangeMessageTemplate;
