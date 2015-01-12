/**
 * @file Statistics Repository
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */
var moment = require('moment');
var Query = require('./models/Query');

/**
 * Handles statistics for application.
 * @param app
 * @constructor
 */
function StatisticsRepository(app){
    this.app = app;
    var debug = this.app.get('debug')('StatisticsRepository');
}

/**
 * Add a client query to the database.
 * @param queryString Client's string query, in original form.
 * @param request The request object retrieved from express.
 */
StatisticsRepository.prototype.addQuery = function(queryString, request){
    var query = new Query({
        origin: request.ip,
        path: request.url,
        query: queryString,
        fromXHR: request.xhr,
        date: moment().toDate()
    });

    query.save(function(err){
        if(err instanceof Error) {
            debug.error(err);
            return false;
        }
        return true;
    });
};

module.exports = StatisticsRepository;