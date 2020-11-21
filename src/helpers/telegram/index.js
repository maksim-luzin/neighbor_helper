const { Text, Pause } = require('claudia-bot-builder').telegramTemplate;

module.exports.pause = (time) => new Pause(time).get();

module.exports.hideInlineKeyboard = (messageId) => ({
    method: 'editMessageReplyMarkup',
    body: {
        message_id: messageId,
        reply_markup: '{"inline_keyboard":[[]]}',
    },
});

module.exports.sendText = (messageEnum, userLang, extraButton) => {
    const langEnum = userLang ? messageEnum[userLang] : messageEnum;
    const keyboard = messageEnum.keyboard || langEnum.keyboard;
    const template = new Text(langEnum.text);

    if (keyboard) {
        const keyboardButtons = [];
        const callbackPrefix = messageEnum.keyboardPrefix || '';

        for (const row of keyboard) {
            const newRow = [];

            for (const col of row) {
                const [text, callback_data = ''] = col;

                newRow.push({
                    text,
                    callback_data: `${callbackPrefix}${callback_data}`,
                });
            }

            keyboardButtons.push(newRow);
        }

        if (extraButton) {
            keyboardButtons.push([{ text: extraButton[userLang], callback_data: extraButton.keyboardPrefix }]);
        }

        template.addInlineKeyboard(keyboardButtons);
    }

    return template.get();
};
