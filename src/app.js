/**
 * @file Application master file, contains primary aspects of launching RSSNavigator Webservice. Based on Express/Node boilerplate.
 * @requires module:express
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */

var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var less = require('less-middleware');
var app = express();

app.set('name', 'Bluebird');
app.set('devmode', app.get('env') === 'development');

// view engine setup
app.use(less(path.join(__dirname, 'public', 'less'), {
    force: true
}));
app.set('views', path.join(__dirname, ''));
app.set('view engine', 'jade');

//- app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set configuration for development if development environment specified
if(app.get('env') === 'development'){
    // Database configuration
    app.set('databaseEnabled', true);
    app.set('databaseAddress', 'mongodb://localhost:27017/bluebird');

} else {
    // assume production
    app.set('env', 'production');

    // Database configuration
    app.set('databaseEnabled', true);
    app.set('databaseAddress', process.env.DB_ADDRESS || 'mongodb://localhost:27017/bluebird');

}


// BBYOpen Configuration
app.set('bbyOpenEnabled', true);
app.set('bbyOpenAddress', 'http://api.remix.bestbuy.com/v1/');

// Mount directory "/public" as public facing directory "/"
app.use(express.static(path.join(__dirname, 'public')));

// Mount directory "/bower_components" as public facing directory "/libraries"
app.use('/libraries', express.static(path.join(__dirname, '../bower_components')));

// Enable RouteController to handle application routes
var routeController = require('./controllers/RouteController');
app.use(new routeController((app)));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        //res.status(err.status || 500);
        res.render('views/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    //res.status(err.status || 500);
    res.render('views/error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;