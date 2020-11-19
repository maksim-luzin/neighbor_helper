const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');

dotEnv.config();

const { logger } = require('./loggers');

const app = express();

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
        .status(err.status)
        .json({
            message: err.message,
            code: err.code
        });
})

module.exports = app;
