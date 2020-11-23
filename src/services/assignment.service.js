const {
  models: {
    Assignment,
    User,
    Location,
  },
} = require('../database');

const ServiceResponse = require('../helpers/ServiceResponse');

module.exports = {
  async create({
    title,
    description,
    reward = null,
    link = null,
    pictureUrl = null,
    category,
    authorTelegramId,
    localLocationName,
  }) {
    try {
      const result = await User.findOne({
        where: {
          telegramId: authorTelegramId,
        },
        include: [{
          model: Location,
          attributes: ['id'],
          where: {
            localName: localLocationName,
          },
        }],
        attributes: ['telegramId'],
      });

      if (result) {
        if (result.dataValues.Locations.length !== 0) {
          await Assignment.create({
            title,
            description,
            reward,
            link,
            pictureUrl,
            category,
            authorTelegramId: result.dataValues.telegramId,
            locationId: result.dataValues.Locations[0].id,
          });
        }

        return new ServiceResponse({ succeeded: true });
      }

      return new ServiceResponse({
        succeeded: true,
        message: `No locations were found using user's telegramId=${authorTelegramId} `
               + `and location's localName=${localLocationName}`,
      });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: 'Error occurred while creating assignment with '
               + `title=${title}, telegramId=${authorTelegramId}, description=${description}, `
               + `reward=${reward}, link=${link}, pictureUrl=${pictureUrl}, `
               + `category=${category},  localLocationName=${localLocationName}. `
               + `${e}`,
      });
    }
  },
};
