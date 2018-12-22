require('babel-core/register');
import './data/db';
import express from 'express';
let app = express();
import routes from './src/routing';
import bodyParser from 'body-parser';

app.set('port', 3000);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log('type of your method ' + req.method + ' with url: ' + req.url)
    next();
})

app.use('/', routes);

let server = app.listen(app.get('port'), () => {
    var port = server.address().port;
    console.log('All run on port: ' + port)
})
