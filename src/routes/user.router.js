const express = require('express');

const {
    userController: {
        createUser,
        updateUser,
        deleteUser,
        getAllUsers,
        getById
    }
} = require('../controllers');

const router = express.Router();

router.post('/',   createUser);
router.get('/', getAllUsers);
router.get('/:telegram_id', getById);
router.patch('/:telegram_id', updateUser);
router.delete('/:telegram_id', deleteUser);

module.exports = router
