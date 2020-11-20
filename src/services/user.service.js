const {
    models: {
        User
    }
} = require('../dataBase');

const ServiceResponse = require('../helpers/ServiceResponse');

module.exports = {
    async create(telegramId) {
        try {
            const result = await User.findOrCreate({
                where: {
                    telegramId: telegramId
                },
                defaults: {
                    telegramId: telegramId
                }
            });
            const created = result[1];

            if (created)
                return new ServiceResponse( { succeeded: true} );

            return new ServiceResponse ( { succeeded: true, message: `User with such telegramId=${telegramId} already exists.` } );
        } catch {
            return new ServiceResponse ( { succeeded: false, message: `Error occurred while creating user with telegramId=${telegramId}.` } )
        }
    },
}
