const {
  models: {
    Assignment,
    User,
    Location,
    FavoriteAssignment,
    Spam,
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

      const categoryCondition = category ? `AND A.category = '${category}'` : '';
      const nearbyAssignments = await sequelize.query(
        `SELECT A.id, A.title, A.description, A.reward, A."pictureUrl", L."globalName", A."authorTelegramId",
        EXISTS (
        SELECT 1 FROM "FavoriteAssignments" FA 
        WHERE FA."assignmentId" = A.id
        AND FA."telegramId" = ${telegramId}) AS "isFavorite"
        FROM "Assignments" A
        INNER JOIN "Locations" L ON A."locationId" = L.id
        LEFT JOIN "Spams" S ON A.id = S."assignmentId"
        AND s."telegramId" = ${telegramId}
        WHERE ST_DWithin(L.coordinates, 
        ST_MakePoint(${foundRangeAndCoordinates.Locations[0].coordinates.coordinates[0]},
        ${foundRangeAndCoordinates.Locations[0].coordinates.coordinates[1]}), 
        ${foundRangeAndCoordinates.range} * 1000)
        ${categoryCondition}
        AND A."authorTelegramId" <> ${telegramId}
        AND A.status <> 'done'
        AND S."assignmentId" IS NULL
        ORDER BY L.coordinates <-> L.coordinates`,
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
      const query = 'SELECT A."id", A."title", A."description", A."reward", A."authorTelegramId",'
      + `A."pictureUrl", L."globalName"
      FROM "Assignments" A
      INNER JOIN "FavoriteAssignments" FA ON A.id = fa."assignmentId"
      AND FA."telegramId" = ${telegramId}
      LEFT JOIN "Spams" S ON a.id = S."assignmentId"
      AND S."telegramId" = ${telegramId}
      INNER JOIN "Locations" L on a."locationId" = L.id
      WHERE S."telegramId" IS NULL
      AND A.status <> 'done'`;

      const result = await sequelize.query(query);
      const favoriteAssignments = result[0];

      return new ServiceResponse({
        succeeded: true,
        model: favoriteAssignments.map((elem) => ({
          id: elem.id,
          title: elem.title,
          description: elem.description,
          reward: elem.reward,
          authorTelegramId: elem.authorTelegramId,
          pictureUrl: elem.pictureUrl,
          locationName: elem.globalName,
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

  async markAsSpam({ telegramId, assignmentId }) {
    try {
      await Assignment.increment(
        { spamScore: 1 },
        {
          where: {
            id: assignmentId,
          },
          returning: false,
        },
      );

      const assignment = await Assignment.findOne({
        where: {
          id: assignmentId,
        },
        attributes: ['id', 'spamScore'],
      });

      if (assignment.spamScore >= 5) {
        await assignment.destroy();
        await Spam.destroy(
          {
            where: {
              assignmentId,
            },
          },
        );
      } else {
        await Spam.findOrCreate({
          where: {
            telegramId,
            assignmentId,
          },
          defaults: {
            telegramId,
            assignmentId,
          },
          attributes: ['id'],
        });
      }

      return new ServiceResponse({ succeeded: true });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: 'Error occurred while marking assignment as spam with '
          + `telegramId=${telegramId}, assignmentId=${assignmentId}. `
          + `${e}.`,
      });
    }
  },

  async get({ telegramId, assignmentId }) {
    try {
      const query = `SELECT A.id, A.title, A.reward, A.description, 
      A."pictureUrl", L."globalName" as "locationName",
      EXISTS (
      SELECT 1 FROM "FavoriteAssignments" FA 
      WHERE FA."assignmentId" = ${assignmentId}
      AND FA."telegramId" = ${telegramId}) AS "isFavorite"
      FROM "Assignments" A 
      INNER JOIN "Locations" L
      ON A."locationId" = L.id
      WHERE A.id = ${assignmentId}
      LIMIT 1`;

      const result = await sequelize.query(query);
      const foundAssignment = result[0][0];

      if (foundAssignment) {
        return new ServiceResponse({ succeeded: true, model: foundAssignment });
      }
      return new ServiceResponse({ succeeded: true });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: 'Error occurred while getting assignment by id with '
          + `assignmentId=${assignmentId}. `
          + `${e}.`,
      });
    }
  },
};
