const {
  models: {
    Assignment,
    User,
    Location,
    sequelize,
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

  async getAllNearby({ telegramId, category = null, localLocationName }) {
    try {
      const foundRangeAndCoordinates = await User.findOne({
        where: {
          telegramId,
        },
        attributes: ['range'],
        include: [{
          model: Location,
          where: {
            localName: localLocationName,
          },
          attributes: ['coordinates'],
        }],
      });

      const categoryCondition = category ? `AND a.category = ${category}` : '';
      const nearbyAssignments = await sequelize.query(
        `SELECT a.title, a.description, a.reward, a."pictureUrl", l."globalName", a."authorTelegramId"
        FROM "Assignments" a
        INNER JOIN "Locations" l ON a."locationId" = l.id
        WHERE ST_DWithin(l.coordinates, 
        ST_MakePoint(${foundRangeAndCoordinates.dataValues.Locations[0].dataValues.coordinates.coordinates[0]},
        ${foundRangeAndCoordinates.dataValues.Locations[0].dataValues.coordinates.coordinates[1]}), 
        ${foundRangeAndCoordinates.dataValues.range} * 1000)
        ${categoryCondition}
        ORDER BY l.coordinates <-> l.coordinates`,
      );

      return new ServiceResponse({
        succeeded: true,
        model: nearbyAssignments[0],
      });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: 'Error occurred while getting all nearby assignments with '
          + `telegramId=${telegramId}, category=${category}. `
          + `${e}`,
      });
    }
  },

  async getAllFavorites({ telegramId }) {
    try {
      const favoriteAssignments = await User.findOne({
        where: {
          telegramId,
        },
        attributes: [],
        include: [{
          model: Assignment,
          as: 'favoriteAssignments',
          attributes: ['title', 'description', 'reward', 'pictureUrl', 'authorTelegramId'],
          include: [{
            model: Location,
            attributes: ['globalName'],
          }],
        }],
      });

      return new ServiceResponse({
        succeeded: true,
        model: favoriteAssignments.dataValues.favoriteAssignments.map((elem) => ({
          title: elem.dataValues.title,
          description: elem.dataValues.description,
          reward: elem.dataValues.reward,
          authorTelegramId: elem.dataValues.authorTelegramId,
          pictureUrl: elem.dataValues.pictureUrl,
          locationName: elem.dataValues.Location.dataValues.globalName,
        })),
      });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: 'Error occurred while getting all favorite assignments with '
          + `telegramId=${telegramId}. `
          + `${e}`,
      });
    }
  },
};
