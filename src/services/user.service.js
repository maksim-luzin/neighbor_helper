const {
  models: {
    User,
  },
} = require('../database');

const ServiceResponse = require('../helpers/ServiceResponse');

module.exports = {
  async create({ telegramId }) {
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

  async update({ telegramId = null, newRange = null, newLocale = null }) {
    try {
      const foundUser = await User.findOne({
        where: {
          telegramId,
        },
      });

      if (foundUser) {
        await foundUser.update({
          range: newRange || foundUser.range,
          locale: newLocale || foundUser.locale,
        });

        return new ServiceResponse({ succeeded: true });
      }
      return new ServiceResponse({
        succeeded: true,
        message: `User with such telegramId=${telegramId} was not found.`,
      });
    } catch {
      return new ServiceResponse({
        succeeded: false,
        message: `Error occurred while updating user with telegramId=${telegramId}`
          + `with values newRange=${newRange} and newLocale=${newLocale}`,
      });
    }
  },

  async getOne({ telegramId, params }) { // params: ['locale', 'range'] - example
    try {
      const foundUser = await User.findOne({
        where: {
          telegramId,
        },
        attributes: params,
      });

      if (foundUser) {
        return new ServiceResponse({
          succeeded: true,
          model: foundUser.dataValues,
        });
      }
      return new ServiceResponse({
        succeeded: true,
        message: `User with such telegramId=${telegramId} was not found`,
      });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: `Error occurred while getting user's locale with telegramId=${telegramId}`
          + `${e}.`,
      });
    }
  },
};
