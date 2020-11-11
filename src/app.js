const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');

const { logger } = require('./loggers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

app.use((err, req ,res ,next) =>{
    logger.error({
        method: req.method,
        url: req.path,
        data: req.body,
        time: new Date(),
        massage: err.message
    });
    next(err);
})

module.exports = app;
