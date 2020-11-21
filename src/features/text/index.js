const { enums, telegram } = require('../../helpers');

module.exports = ({ text }) => {
  switch (text) {
    case '/start': {
      return telegram.sendText(enums.start);
    }
    case '': {
      return 'dpp';
    }
    default: {
      return '';
    }
  }
};
