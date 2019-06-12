require('dotenv-safe').config();
const express = require('express');
const cors = require('cors');
require('./config/passport-setup');

const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const logger = require('morgan');

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true})
    .then(result => console.log("Mongo connected!"))
    .catch(error => console.error("Error in mongo connection", error));

app.use(logger('dev'));
app.use(routes);

module.exports = app;
