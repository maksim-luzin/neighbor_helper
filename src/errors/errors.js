module.exports = {
    // 400
    BAD_REQUEST_WRONG_PARAMS: {
        message: 'Bad request wrong params',
        code: 4000
    },
    BAD_REQUEST_USER_ALREADY_EXIST: {
        message: 'User already exist',
        code: 4001
    },
    
    // 404
    NOT_FOUND_ROUTE: {
        message: 'API route not found',
        code: 4041
    },
    NOT_FOUND_ENTITY_NOT_PRESENT: {
        message: 'Not found',
        code: 4042
    },

    // 500
    SERVER_UNKNOWN_ERROR: {
        message: 'Unknown error',
        code: 5001
    }
};
