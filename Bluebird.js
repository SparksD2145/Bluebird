#!/usr/bin/env node

/** @file Bluebird initialization script. */

/** Initialize Debugger and load Bluebird. */
var debug = require('debug')('Bluebird');
var run = function(app){
    /** Set the server port of Bluebird. */
    app.set('port', process.env.PORT || 80);

    /** Start Bluebird's Express server */
    var server = app.listen(app.get('port'), function() {
        debug('Bluebird express server listening on port ' + server.address().port);
    });
};

if(process.env.node_env !== 'development'){
    // Build the application and run (fix for nodejitsu deployment)
    var exec = require('child_process').exec;
    var buildProcess = exec('grunt build', {
        cwd: __dirname
    }, function(){
        var app = require('./build/app');
        run(app);
    });
} else {
    var app = require('./src/app');
}

