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

  async update({
    telegramId,
    params, // ['range', 'locale', 'state' ...]
  }) {
    try {
      const attributes = Object.getOwnPropertyNames(params);
      attributes.push('telegramId');

      if (params.state) {
        const foundUser = await User.findOne({
          where: {
            telegramId,
          },
          attributes,
        });
        if (foundUser) {
          // eslint-disable-next-line no-param-reassign
          params.state = {
            ...foundUser.state,
            ...params.state,
          };
          if (params.state.data) {
            if (Object.keys(params.state.data).length !== 0) {
              // eslint-disable-next-line no-param-reassign
              params.state.data = {
                ...foundUser.state.data,
                ...params.state.data,
              };
            }
          }
        }

        const updatedUser = await foundUser.update(params);

        return new ServiceResponse({
          succeeded: true,
          model: params.state ? updatedUser.state : null,
        });
      }

      // проверка на стейт нужна, чтобы не делать лишний селект, т.к. при обновлении стейта
      // он необходим, а при обновлении языка - нет.
      await User.update(
        params,
        { where: { telegramId } },
      );

      return new ServiceResponse({ succeeded: true });
    } catch (e) {
      return new ServiceResponse({
        succeeded: false,
        message: `Error occurred while updating user with telegramId=${telegramId}`
          + `with values params=${params}`
          + `${e}.`,
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
