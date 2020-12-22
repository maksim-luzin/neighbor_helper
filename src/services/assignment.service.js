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

const { getPagingData } = require('../helpers/pagination');
const { REQUIRED_SPAM_SCORE_TO_DELETE } = require('../configs/global.config');

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
        if (result.Locations.length) {
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

  async getAllNearby({
    telegramId,
    category = null,
    locationId,
    pagination: { limit, offset },
    page,
  }) {
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

      const nearbyAssignmentsQuery = `SELECT A.id, A.title, A.description, A.reward, 
      A."pictureUrl", L."globalName", A."authorTelegramId",
      EXISTS (
      SELECT 1 FROM "FavoriteAssignments" FA 
      WHERE FA."assignmentId" = A.id
      AND FA."telegramId" = ${telegramId}) AS "isFavorite"
      FROM "Assignments" A
      INNER JOIN "Locations" L ON A."locationId" = L.id
      LEFT JOIN "Spams" S ON A.id = S."assignmentId"
      AND S."telegramId" = ${telegramId}
      WHERE ST_DWithin(L.coordinates, 
      ST_MakePoint(${foundRangeAndCoordinates.Locations[0].coordinates.coordinates[0]},
      ${foundRangeAndCoordinates.Locations[0].coordinates.coordinates[1]}),
      ${foundRangeAndCoordinates.range} * 1000)
      ${categoryCondition}
      AND A."authorTelegramId" <> ${telegramId}
      AND A.status <> 'done'
      AND S."assignmentId" IS NULL
      ORDER BY L.coordinates <-> L.coordinates
      LIMIT ${limit} 
      OFFSET ${offset}`;

      const nearbyAssignmentsCountQuery = `SELECT COUNT(A.id)
      FROM "Assignments" A
      INNER JOIN "Locations" L ON A."locationId" = L.id
      LEFT JOIN "Spams" S ON A.id = S."assignmentId"
      AND S."telegramId" = ${telegramId}
      WHERE ST_DWithin(L.coordinates, 
      ST_MakePoint(${foundRangeAndCoordinates.Locations[0].coordinates.coordinates[0]},
      ${foundRangeAndCoordinates.Locations[0].coordinates.coordinates[1]}), 
      ${foundRangeAndCoordinates.range} * 1000)
      ${categoryCondition}
      AND A."authorTelegramId" <> ${telegramId}
      AND A.status <> 'done'
      AND S."assignmentId" IS NULL`;

      const [[nearbyAssignments], [[nearbyAssignmentsCount]]] = await Promise.all([
        sequelize.query(nearbyAssignmentsQuery),
        sequelize.query(nearbyAssignmentsCountQuery),
      ]);

      return new ServiceResponse({
        succeeded: true,
        pagingData: getPagingData(nearbyAssignmentsCount, page, limit),
        model: nearbyAssignments,
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

  async getAllFavorites({
    telegramId,
    pagination: { limit, offset },
    page,
  }) {
    try {
      const queryRecords = 'SELECT A."id", A."title", A."description", A."reward", A."authorTelegramId",'
      + `A."pictureUrl", L."globalName"
      FROM "Assignments" A
      INNER JOIN "FavoriteAssignments" FA ON A.id = FA."assignmentId"
      AND FA."telegramId" = ${telegramId}
      LEFT JOIN "Spams" S ON A.id = S."assignmentId"
      AND S."telegramId" = ${telegramId}
      INNER JOIN "Locations" L on A."locationId" = L.id
      WHERE S."telegramId" IS NULL
      AND A.status <> 'done'
      LIMIT ${limit} 
      OFFSET ${offset}`;

      const queryCount = `SELECT COUNT(A.id) as count
      FROM "Assignments" A
      INNER JOIN "FavoriteAssignments" FA ON A.id = FA."assignmentId"
      AND FA."telegramId" = ${telegramId}
      LEFT JOIN "Spams" S ON A.id = S."assignmentId"
      AND S."telegramId" = ${telegramId}
      WHERE S."telegramId" IS NULL
      AND A.status <> 'done'`;

      const [[favoriteAssignments], [[countResult]]] = await Promise.all([
        sequelize.query(queryRecords),
        sequelize.query(queryCount),
      ]);

      favoriteAssignments.count = countResult.count;

      return new ServiceResponse({
        succeeded: true,
        pagingData: getPagingData(favoriteAssignments, page, limit),
        model: favoriteAssignments.map((elem) => ({
          id: elem.id,
          title: elem.title,
          description: elem.description,
          reward: elem.reward,
          authorTelegramId: elem.authorTelegramId,
          authorUsername: elem.authorUsername,
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
    telegramId,
    pagination: { limit, offset },
    page,
  }) {
    try {
      const createdAssignments = await Assignment.findAndCountAll({
        where: {
          authorTelegramId: telegramId,
        },
        order: [
          ['id', 'ASC'],
        ],
        include:
          [
            {
              model: Location,
            },
            {
              model: User,
              as: 'author',
              attributes: [],
            },
          ],
        limit,
        offset,
      });

      return new ServiceResponse({
        succeeded: true,
        pagingData: getPagingData(createdAssignments, page, limit),
        model: createdAssignments.rows.map((elem) => ({
          id: elem.dataValues.id,
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
    const t = await sequelize.transaction();

    try {
      const [[assignment]] = await sequelize.query(`UPDATE "Assignments" A
      SET "spamScore" = "spamScore" + 1, "updatedAt" = NOW() 
      WHERE "id" = ${assignmentId} RETURNING A."spamScore"`);

      if (assignment.spamScore >= REQUIRED_SPAM_SCORE_TO_DELETE) {
        await Promise.all([
          Assignment.destroy({
            where: {
              id: assignmentId,
            },
          },
          { transaction: t }),

          Spam.destroy(
            {
              where: {
                assignmentId,
              },
            },
            { transaction: t },
          )]);
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

      await t.commit();
      return new ServiceResponse({ succeeded: true });
    } catch (e) {
      await t.rollback();
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
      A."authorTelegramId", EXISTS (
      SELECT 1 FROM "FavoriteAssignments" FA 
      WHERE FA."assignmentId" = ${assignmentId}
      AND FA."telegramId" = ${telegramId}) AS "isFavorite"
      FROM "Assignments" A 
      INNER JOIN "Locations" L
      ON A."locationId" = L.id
      WHERE A.id = ${assignmentId}
      LIMIT 1`;

      const [[foundAssignment]] = await sequelize.query(query);

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
