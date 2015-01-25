#!/usr/bin/env node

/** @file Bluebird initialization script. */

/** Initialize Debugger and load Bluebird. */
var debug = require('debug')('Bluebird');
var app = require('./src/app');

/** Set the server port of Bluebird. */
app.set('port', process.env.PORT || 80);

/** Start Bluebird's Express server */
var server = app.listen(app.get('port'), function() {
  debug('Bluebird express server listening on port ' + server.address().port);
});