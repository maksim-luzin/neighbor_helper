const {
  models: {
    Location,
    User,
  },
} = require('../database');

const ServiceResponse = require('../helpers/ServiceResponse');

module.exports = {
  async create({
    telegramId, coordinates, localName, globalName, // coordinates: [longitude, latitude]
  }) {
    try {
      const foundUser = await User.findOne({
        where: {
          telegramId,
        },
      });

      if (foundUser) {
        const foundLocationName = await Location.findOne({
          where: {
            telegramId,
            localName,
          },
        });

        if (!foundLocationName) {
          await Location.create({
            telegramId,
            coordinates: { type: 'Point', coordinates },
            localName,
            globalName,
          });

          return new ServiceResponse({ succeeded: true });
        }

        return new ServiceResponse({
          succeeded: true,
          message: `Location name '${localName}' is already taken!`,
        });
      }
      return new ServiceResponse({
        succeeded: true,
        message: `User with such telegramId=${telegramId} was not found.`,
      });
    } catch {
      return new ServiceResponse({
        succeeded: false,
        message: `Error occurred while creating location with telegramId=${telegramId} `
               + `coordinates=${coordinates}, localName=${localName}, globalName=${globalName}.`,
      });
    }
  },

};
