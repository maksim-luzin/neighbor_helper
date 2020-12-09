const {
  models: {
    Assignment,
    User,
    Location,
    FavoriteAssignment,
    sequelize,
  },
} = require('../database');

const getPagingData = require('../helpers/getPagingData');

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
        if (result.Locations.length !== 0) {
          await Assignment.create({
            title,
            description,
            reward,
            link,
            pictureUrl,
            category,
            authorTelegramId: result.telegramId,
            locationId: result.Locations[0].id,
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

  async getAllNearby({ telegramId, category = null, locationId }) {
    try {
      const foundRangeAndCoordinates = await User.findOne({
        where: {
          telegramId,
        },
        attributes: ['range'],
        include: [{
          model: Location,
          where: {
            id: locationId,
          },
          attributes: ['coordinates'],
        }],
      });

      const categoryCondition = category ? `AND a.category = '${category}'` : '';
      const nearbyAssignments = await sequelize.query(
        `SELECT a.id, a.title, a.description, a.reward, a."pictureUrl", l."globalName", a."authorTelegramId"
        FROM "Assignments" a
        INNER JOIN "Locations" l ON a."locationId" = l.id
        WHERE ST_DWithin(l.coordinates, 
        ST_MakePoint(${foundRangeAndCoordinates.Locations[0].coordinates.coordinates[0]},
        ${foundRangeAndCoordinates.Locations[0].coordinates.coordinates[1]}), 
        ${foundRangeAndCoordinates.range} * 1000)
        ${categoryCondition}
        AND a."authorTelegramId" <> ${telegramId}
        AND a.status <> 'done'
        ORDER BY l.coordinates <-> l.coordinates`,
      );

      // eslint-disable-next-line no-restricted-syntax
      for await (const assignment of nearbyAssignments[0]) {
        const foundFavorite = await FavoriteAssignment.findOne({
          where: {
            telegramId,
            assignmentId: assignment.id,
          },
        });
        // eslint-disable-next-line no-param-reassign
        assignment.isFavorite = !!foundFavorite;
      }

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
        include: [{
          model: Assignment,
          as: 'favoriteAssignments',
          include: [{ model: Location }],
        }],
      });

      return new ServiceResponse({
        succeeded: true,
        model: favoriteAssignments.favoriteAssignments.map((elem) => ({
          id: elem.id,
          title: elem.title,
          description: elem.description,
          reward: elem.reward,
          authorTelegramId: elem.authorTelegramId,
          pictureUrl: elem.pictureUrl,
          locationName: elem.Location.globalName,
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

  async getCreated({
    telegramId, limit, offset, page,
  }) {
    try {
      const createdAssignments = await Assignment.findAndCountAll({
        where: {
          authorTelegramId: telegramId,
        },
        include: [{ model: Location }],
        limit,
        offset,
      });

      return new ServiceResponse({
        succeeded: true,
        pagingData: getPagingData(createdAssignments, page, limit),
        model: createdAssignments.rows.map((elem) => ({
          title: elem.dataValues.title,
          description: elem.dataValues.description,
          status: elem.dataValues.status,
          reward: elem.dataValues.reward,
          authorTelegramId: elem.dataValues.authorTelegramId,
          pictureUrl: elem.dataValues.pictureUrl,
          locationName: elem.dataValues.Location.dataValues.globalName,
          localLocationName: elem.dataValues.Location.dataValues.localName,
        })),
      });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: 'Error occurred while getting created assignments with '
          + `telegramId=${telegramId}. `
          + `${e}`,
      });
    }
  },

  async delete({ telegramId, assignmentId }) {
    try {
      const foundAssignment = await Assignment.findOne({
        where: {
          id: assignmentId,
          authorTelegramId: telegramId,
        },
        attributes: ['id'],
      });

      if (foundAssignment) {
        await foundAssignment.destroy();
        return new ServiceResponse({ succeeded: true });
      }

      return new ServiceResponse({
        succeeded: true,
        message: `Assigment with id=${assignmentId} wasn't`
          + `found on user with telegramId=${telegramId}.`,
      });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: 'Error occurred while deleting assignment with '
          + `telegramId=${telegramId}, assignmentId=${assignmentId}. `
          + `${e}.`,
      });
    }
  },

  async update({ telegramId, assignmentId, status = null }) {
    try {
      const foundAssignment = await Assignment.findOne({
        where: {
          id: assignmentId,
          authorTelegramId: telegramId,
        },
        attributes: ['id'],
      });

      if (foundAssignment) {
        await foundAssignment.update({
          status: status || foundAssignment.status,
        });
        return new ServiceResponse({ succeeded: true });
      }

      return new ServiceResponse({
        succeeded: true,
        message: `Assigment with id=${assignmentId} wasn't`
          + `found on user with telegramId=${telegramId}.`,
      });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: 'Error occurred while updating assignment with '
          + `authorTelegramId=${telegramId}, id=${assignmentId}, status=${status}. `
          + `${e}.`,
      });
    }
  },

  async addToFavorites({ telegramId, assignmentId }) {
    try {
      await FavoriteAssignment.findOrCreate({
        where: {
          telegramId,
          assignmentId,
        },
        defaults: {
          telegramId,
          assignmentId,
        },
      });

      return new ServiceResponse({ succeeded: true });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: 'Error occurred while adding assignment to favorites with '
          + `telegramId=${telegramId}, id=${assignmentId}. `
          + `${e}.`,
      });
    }
  },

  async removeFromFavorites({ telegramId, assignmentId }) {
    try {
      await FavoriteAssignment.destroy({
        where: {
          telegramId,
          assignmentId,
        },
      });

      return new ServiceResponse({ succeeded: true });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: 'Error occurred while adding assignment to favorites with '
          + `telegramId=${telegramId}, id=${assignmentId}. `
          + `${e}.`,
      });
    }
  },
};
