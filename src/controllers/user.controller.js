const { userService } = require('../services');
const {
    enums: {
        ResponseStatusCodes: {
            CREATED,
            NO_CONTENT
        }
    }
} = require('../constants');

module.exports = {
    async createUser(req, res, next) {
        try {

            await userService.create(req.body);

            res.sendStatus(CREATED);

        } catch (error) {
            next(error);
        }
    },
    async updateUser(req, res, next) {
        try {
            const {id} = req.user;

            await userService.update(id, req.body);

            res.sendStatus(CREATED);

        } catch (error) {
            next(error);
        }
    },

    async deleteUser(req, res, next) {
        try {
            const {id} = req.user;

            await userService.delete(id);

            res.sendStatus(NO_CONTENT);

        } catch (error) {
            next(error);
        }
    },

    async getAllUsers(req, res, next) {
        try {
            const {id} = req.query;
            const users = await userService.getAll(id);

            res.json({
                data: users
            });

        } catch (error) {
            next(error);
        }
    },

    getById(req, res, next) {
        try {
            const user = req.user;

            res.json({
                data: user
            });

        } catch (error) {
            next(error);
        }
    }
}
