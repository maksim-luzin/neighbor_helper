const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))


module.exports = app;
