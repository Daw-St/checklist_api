var mongoose = require('mongoose');
var dburl = 'mongodb://mo1260_cc_chil:T8p1QIfTH51PPrFC1Pjk@mongo22.mydevil.net:27017/mo1260_cc_chil'

mongoose.connect(dburl);
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dburl)
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected')
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error ' + err)
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongose disconnected through app termination')
        process.exit(0);
    });
});

process.on('SIGTERM', function() {
    mongoose.connection.close(function() {
        console.log('Mongose disconnected through app termination')
        process.exit(0);
    });
});

process.once('SIGUSR2', function() {
    mongoose.connection.close(function() {
        console.log('Mongose disconnected through app termination')
        process.kill(process.pid, 'SIGUSR2');
    });
});

require('./tasks.model');