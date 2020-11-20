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


    async updateRange(telegramId, newRange) {
        try {
            const foundUser = await User.findOne({
                where: {
                    telegramId: telegramId
                }
            })

            if (foundUser) {
                const result = await foundUser.update({
                    range: newRange
                })

                if (result._previousDataValues.range !== result.dataValues.range) return new ServiceResponse( { succeeded: true} )
                return new ServiceResponse( { succeeded: true, message: `Range of user with telegramId=${telegramId} was not updated.`} )
            }
            return new ServiceResponse( { succeeded: true, message: `User with such telegramId=${telegramId} was not found.` } )
        } catch (e) {
            return new ServiceResponse ( { succeeded: false, message: `Error occurred while updating user with telegramId=${telegramId}` } )
        }
    }
}
