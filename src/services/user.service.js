const {
    models: {
        user
    }
} = require('../dataBase');

module.exports = {
    create(user) {
        return user.create(user);
    },
    update(id, updateFields) {
        return user.update(updateFields, {
            where: {id}
        });
    },
    delete(id) {
        return user.destroy({
            where: {id}
        });
    },
    getById(id) {
        return user.findOne({
            where: {id}
        });
    }
}
