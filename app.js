
//require('babel-core/register');

require('./src/data/db')
const config = require('config');
const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);

if(!config.get('jwtPrivateKey')){
    console.log(897789897);
    console.log('FATAL ERROR: jwtPrivatekey is not defined.');
    process.exit(1);
};


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { REFUSED } = require('dns');
const helmet = require('helmet');
const morgan = require('morgan');
const auth = require('./src/routes/auth');


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
app.use('/api/auth', auth);

let server = app.listen(app.get('port'), () => {
    var port = server.address().port;
    console.log('All run on port: ' + port)
})
