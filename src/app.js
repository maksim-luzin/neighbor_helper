const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');

dotEnv.config();

const {
    errors: {
        SERVER_UNKNOWN_ERROR: {
            message,
            code
        }
    }
} = require('./errors');
const {
    enums: {
        ResponseStatusCodes: {
            SERVER_ERROR
        }
    }
} = require('./constants');
const { logger } = require('./loggers');
// const {
//     associations: {
//         initDBAssociations
//     }
// } = require('./dataBase');

const app = express();

// initDBAssociations();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

app.use((err, req ,res ,next) => {
    logger.error({
        method: req.method,
        url: req.path,
        data: req.body,
        time: new Date(),
        massage: err.message
    });
    next(err);
})

app.use((err, req, res, next) => {
    if (err.parent) {
       err.message('Err');
    }

    res
        .status(err.status || SERVER_ERROR)
        .json({
            message: err.message || message,
            code: err.code || code
        });
})

module.exports = app;
