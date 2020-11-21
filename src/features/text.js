const { logger, enums, telegram } = require('../../helpers');

module.exports = ({ text }) => {
    switch (text) {
        case '/start': {
            return telegram.sendText(enums.start);
        }
        default: {
            return;
        }
    }
};
