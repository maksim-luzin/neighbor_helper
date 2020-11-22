const {
  models: {
    User,
  },
} = require('../database');

const ServiceResponse = require('../helpers/ServiceResponse');

module.exports = {
  async create(telegramId) {
    try {
      const result = await User.findOrCreate({
        where: {
          telegramId,
        },
        defaults: {
          telegramId,
        },
      });
      const created = result[1];

      if (created) { return new ServiceResponse({ succeeded: true }); }

      return new ServiceResponse({
        succeeded: true,
        message: `User with such telegramId=${telegramId} already exists.`,
      });
    } catch {
      return new ServiceResponse({
        succeeded: false,
        message: `Error occurred while creating user with telegramId=${telegramId}.`,
      });
    }
  },

  async updateRange(telegramId, newRange) {
    try {
      const foundUser = await User.findOne({
        where: {
          telegramId,
        },
      });

      if (foundUser) {
        const result = await foundUser.update({
          range: newRange,
        });

        // eslint-disable-next-line no-underscore-dangle
        if (result._previousDataValues.range !== result.dataValues.range) {
          return new ServiceResponse({ succeeded: true });
        }
        return new ServiceResponse({
          succeeded: true,
          message: `Range of user with telegramId=${telegramId} was not updated.`,
        });
      }
      return new ServiceResponse({
        succeeded: true,
        message: `User with such telegramId=${telegramId} was not found.`,
      });
    } catch {
      return new ServiceResponse({
        succeeded: false,
        message: `Error occurred while updating user with telegramId=${telegramId}`,
      });
    }
  },
};
