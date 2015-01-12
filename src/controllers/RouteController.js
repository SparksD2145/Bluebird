/**
 * @file RouteController controller.
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 * @exports RouteController
 */

/**
 * Handles URL addressing and processing via an Express.Router instance.
 * @class
 * @module RouteController
 * @requires module:express
 * @requires module:underscore
 * @requires module:debug
 * @requires module:ProductRepository
 * @returns {RouteController}
 */
function RouteController(app) {

    /** Initialize instance of Express.Router for routing operations */
    var router = require('express').Router();
    var _ = require('underscore');

    // Initialize an instance of the debugger
    var debug = new (app.get('debug'))('RouteController');

    // Let developers know an instance of the controller is being created.
    debug.log('Initializing an instance of RouteController.');

    /** Require ProductRepository for product operations */
    var ProductRepository = require('../repositories/product/productRepository');
    ProductRepository = new ProductRepository(app);

    /** Require StatisticsRepository for application statistics operations */
    var StatisticsRepository = require('../repositories/statistics/statisticsRepository');
    StatisticsRepository = new StatisticsRepository(app);

    /** Registers URL Route Parameters with Application */
    (function DefineRouteParameters(){
        debug.log('Defining Route Parameters.');

        /** Define 'page' routing parameter and pass to request */
        router.param('page', function(req, res, next, page){
            if(!_.isEmpty(page) && _.isString(page)) req.page = page;
            next();
        });

        /** Define 'id' routing parameter and pass to request */
        router.param('id', function(req, res, next, id){
            if(!_.isEmpty(id) && _.isString(id)) req.id = id;
            next();
        });

        /** Define 'type' routing parameter and pass to request */
        router.param('type', function(req, res, next, type){
            if(!_.isEmpty(type) && _.isString(type)) req.id = type;
            next();
        });
        
        /** Define 'query' routing parameter and pass to request */
        router.param('query', function(req, res, next, query){
            if(!_.isEmpty(query) && _.isString(query)) req.id = query;

            StatisticsRepository.addQuery(query, req);
            next();
        });
    })();

    /** Registers URL Routes with Application */
    (function DefineRoutes() {

        debug.log('Defining Routes.');

        /* GET /:state/*name */
        /** Retrieve individual states */
        router.get('/state/*', function (req, res) {
            /** Work from the states directory */
            var pageStorageUrlPrefix = 'public/states/';

            /** If no state parameter was passed, return a 404 error */
            if(typeof req.params[0] === 'undefined') {
                var err = new Error('Not Found');
                err.status = 404;
                next(err);
                return false;
            }

            /** Get the state and render */
            var state = pageStorageUrlPrefix + req.params[0];
            res.render(state, {
                /** Provide all JADE states a devMode attribute to indicate if in development mode. */
                devMode: app.get('config').application.developmentMode
            });
        });

        /* API ROUTES */
        /* GET /api/:type/:query */
        router.get('/api/:type/:query', function (req, res) {
            var sendGeneralFailure = function(){
                var err = new Error('Not Found');
                err.status = 404;
                //next(err);
                res.end();
                return false;
            };

            if(_.isEmpty(req.params) || _.isEmpty(req.params.type) || _.isEmpty(req.params.query)) sendGeneralFailure();
            if(!_.isString(req.params.type) || !_.isString(req.params.query)) sendGeneralFailure();

            /** Product Search */
            if(req.params.type.toLowerCase() == 'product'){

                // Extended search can quickly drain our query limit, setting it to false by default prevents this.
                var useExtendedSearch = 'false';

                // Check client's request to see if extendedSearch is true and cast it as a boolean.
                if (!_.isEmpty(req.query) && !_.isEmpty(req.query.extendedSearch))
                    useExtendedSearch = req.query.extendedSearch === 'true';

                // Perform a product query.
                ProductRepository.query(req.params.query.toLowerCase(), useExtendedSearch, function(result){
                    if (result instanceof Error) {
                        console.error('Error:', result.message);
                        sendGeneralError();
                    } else {
                        res.json(result);
                    }
                });
            }

            /* GET /api/availability/:query?location=&distance= */
            if(req.params.type.toLowerCase() == 'availability'){

                if (_.isEmpty(req.query) || _.isUndefined(req.query.location)) {
                    sendGeneralFailure();
                    return false;
                }

                if (!_.isEmpty(req.query) && !req.query.distance) {
                    req.query.distance = 25; // default distance (miles) setting
                }

                ProductRepository.runBBYProductAvailabilityQuery(
                    req.params.query.toLowerCase(),
                    req.query.location,
                    req.query.distance,
                    function(result){
                        if (result instanceof Error) {
                            console.error('Error:', result.message);
                            sendGeneralError();
                        } else {
                            res.json(result);
                        }
                    }
                );
            }
        });

        /* Master Route (used for html5 addressing */
        /* ALL / */
        router.all('/*', function(req, res) {
            res.render('views/master', {
                title: app.get('config').application.name,
                devMode: app.get('config').application.developmentMode
            });
        });
    })();

    return router;
}
module.exports = RouteController;