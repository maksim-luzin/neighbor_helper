const { enums, telegram } = require('../../helpers');

module.exports = ({ text }) => {
  switch (text) {
    case '/start': {
      return telegram.sendText(enums.start);
    }
    case '/help': {
      return telegram.sendText(enums.help);
    }
    case '/announcement': {
      return telegram.sendText(enums.announcement());
    }
    default: {
      return '';
    }
  }
};
