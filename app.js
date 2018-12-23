
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
const boards = require('./src/routes/boards')
const invitations = require('./src/routes/invitations')
const comments = require('./src/routes/comments');




app.set('port', 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(helmet());


app.use('/api/tasks', tasks);
app.use('/api/users', users);
app.use('/api/boards', boards);
app.use('/api/invitations', invitations);
app.use('/api/comments', comments);


let server = app.listen(app.get('port'), () => {
    var port = server.address().port;
    console.log('All run on port: ' + port)
})
