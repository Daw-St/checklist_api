//require('babel-core/register');
//require('babel-polyfill');
const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);
const express = require('express');
require('./src/data/db')
const app = express();
const tasks = require('./src/routes/tasks');
const bodyParser = require('body-parser');
const { REFUSED } = require('dns');

app.set('port', 3000);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log('type of your method ' + req.method + ' with url: ' + req.url)
    next();
})

app.use('/api/tasks', tasks);

let server = app.listen(app.get('port'), () => {
    var port = server.address().port;
    console.log('All run on port: ' + port)
})
