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
        attributes: ['telegramId'],
      });

      if (foundUser) {
        const foundLocation = await Location.findOne({
          where: {
            telegramId,
            localName,
          },
          attributes: ['id'],
        });

        if (!foundLocation) {
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
          message: `Location name ${localName} is already taken!`,
        });
      }
      return new ServiceResponse({
        succeeded: true,
        message: `User with such telegramId=${telegramId} was not found.`,
      });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: `Error occurred while creating location with telegramId=${telegramId}
                + coordinates=${coordinates}, localName=${localName}, globalName=${globalName}.
                + ${e}.`,
      });
    }
  },

  async getAllByTelegramId({ telegramId }) {
    try {
      const foundLocations = await User.findOne({
        where: {
          telegramId,
        },
        attributes: [],
        include: [{
          model: Location,
          attributes: ['localName'],
        }],
      });

      if (foundLocations) {
        return new ServiceResponse({
          succeeded: true,
          model: foundLocations.dataValues.Locations.map((elem) => (elem.dataValues)),
        });
      }

      return new ServiceResponse({
        succeeded: true,
        message: `User with such telegramId=${telegramId} was not found.`,
      });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: `Error occurred while getting user's locations with telegramId=${telegramId}. `
          + `${e}.`,
      });
    }
  },
};
