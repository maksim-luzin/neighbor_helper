const {
  models: {
    User,
  },
} = require('../database');

const ServiceResponse = require('../helpers/ServiceResponse');

module.exports = {
  async create({ telegramId, username }) {
    try {
      // TODO array destructuring const [, created]
      const result = await User.findOrCreate({
        where: {
          telegramId,
        },
        defaults: {
          telegramId,
          username,
        },
      });
      const created = result[1];

      if (created) { return new ServiceResponse({ succeeded: true }); }

      return new ServiceResponse({
        succeeded: true,
        message: `User with such telegramId=${telegramId} already exists.`,
      });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: `Error occurred while creating user with telegramId=${telegramId}.`
          + `${e}.`,
      });
    }
  },

  async update({
    telegramId = null,
    newRange = null,
    newLocale = null,
    updatedState = null,
  }, transaction = null) {
    try {
      if (transaction) {
        const foundUser = await User.findOne({
          where: {
            telegramId,
          },
          attributes: ['telegramId', 'range', 'locale', 'state'],
        }, { transaction });

        if (foundUser) {
          await foundUser.update({
            range: newRange || foundUser.range,
            locale: newLocale || foundUser.locale,
            state: updatedState ? { ...foundUser.state, ...updatedState } : foundUser.state,
          }, { transaction });
          return new ServiceResponse({ succeeded: true });
        }
      } else {
        const foundUser = await User.findOne({
          where: {
            telegramId,
          },
          attributes: ['telegramId', 'range', 'locale', 'state'],
        });

        if (foundUser) {
          await foundUser.update({
            range: newRange || foundUser.range,
            locale: newLocale || foundUser.locale,
            state: updatedState ? { ...foundUser.state, ...updatedState } : foundUser.state,
          });
          return new ServiceResponse({ succeeded: true });
        }
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

  async getOne({ telegramId, params }) { // params: ['locale', 'range', 'state'] - example
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
