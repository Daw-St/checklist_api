
//require('babel-core/register');

require('./src/data/db')
const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { REFUSED } = require('dns');
const helmet = require('helmet');
const morgan = require('morgan');

const tasks = require('./src/routes/tasks');
const users = require('./src/routes/users');





app.set('port', 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(helmet());
app.use((req, res, next) => {
    console.log('type of your method ' + req.method + ' with url: ' + req.url)
    next();
})

app.use('/api/tasks', tasks);
app.use('/api/users', users);


let server = app.listen(app.get('port'), () => {
    var port = server.address().port;
    console.log('All run on port: ' + port)
})
