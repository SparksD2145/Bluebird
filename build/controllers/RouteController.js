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

    /** Require VehicleGuideRepository for vehicle fit guide operations */
    var VehicleGuideRepository = require('../repositories/vehicleGuide/vehicleGuideRepository');
    VehicleGuideRepository = new VehicleGuideRepository(app);

    /** Registers URL Route Parameters with Application */
    (function DefineRouteParameters(){
        debug.log('Defining Route Parameters.');

        /** Define 'type' routing parameter and pass to request */
        router.param('resource', function(req, res, next, resource){
            if(!_.isEmpty(resource) && _.isString(resource)) req.resource = resource;
            next();
        });

        /** Define 'type' routing parameter and pass to request */
        router.param('subresource', function(req, res, next, subresource){
            if(!_.isEmpty(subresource) && _.isString(subresource)) req.subresource = subresource;
            next();
        });
        
        /** Define 'query' routing parameter and pass to request */
        router.param('query', function(req, res, next, query){
            if(!_.isEmpty(query) && _.isString(query)) req.id = query;

            StatisticsRepository.addQuery(query, req);
            next();
        });
    })();

    /** Registers API Routes with Application */
    (function DefineAPIRoutes(){

        /* API ROUTES */

        /* GET /api/:resource */
        router.get('/api/:resource', function (req, res) {
            var sendGeneralFailure = function(){
                var err = new Error('Not Found');
                err.status = 404;
                //next(err);
                res.end();
                return false;
            };

            if(_.isEmpty(req.params) || _.isEmpty(req.params.resource)) sendGeneralFailure();

            /** Product API */
            if(req.params.resource.toLowerCase() == 'product'){

                // Extended search can quickly drain our query limit, setting it to false by default prevents this.
                var useExtendedSearch = 'false';
                var condensed = 'false';

                // Check client's request to see if extendedSearch is true and cast it as a boolean.
                if (!_.isEmpty(req.query) && !_.isEmpty(req.query.extendedSearch))
                    useExtendedSearch = req.query.extendedSearch === 'true';

                // Check client's request to see if condensed is true and cast it as a boolean.
                if (!_.isEmpty(req.query) && !_.isEmpty(req.query.condensed))
                    condensed = req.query.condensed === 'true';

                // If the request doesn't include a query, fail the request.
                if(_.isEmpty(req.query) || !req.query.query) {
                    sendGeneralFailure();
                    return false;
                }

                // Perform a product query
                ProductRepository.query(req.query.query.toLowerCase(), useExtendedSearch, condensed, function(result){
                    if (result instanceof Error) {
                        console.error('Error:', result.message);
                        sendGeneralFailure();
                    } else {
                        res.json(result);
                    }
                });
            }

            /* GET /api/availability?query&location=&distance= */
            if(req.params.resource.toLowerCase() == 'availability'){

                if (_.isEmpty(req.query) || _.isUndefined(req.query.location)) {
                    sendGeneralFailure();
                    return false;
                }

                if (!_.isEmpty(req.query) && !req.query.distance) {
                    req.query.distance = 25; // default distance (miles) setting
                }

                // If the request doesn't include a query, fail the request.
                if(_.isEmpty(req.query) || !req.query.query) {
                    sendGeneralFailure();
                    return false;
                }

                ProductRepository.runBBYProductAvailabilityQuery(
                    req.query.query.toLowerCase(),
                    req.query.location,
                    req.query.distance,
                    function(result){
                        if (result instanceof Error) {
                            console.error('Error:', result.message);
                            sendGeneralFailure();
                        } else {
                            res.json(result);
                        }
                    }
                );
            }

            if(req.params.resource.toLowerCase() == 'vehicle'){
                if(typeof req.query.make === 'undefined' ||
                    typeof req.query.year === 'undefined' ||
                    typeof req.query.model == 'undefined') {

                    sendGeneralFailure();
                    return false;
                }

                return VehicleGuideRepository.getVehicle(req.query.year, req.query.make, req.query.model, function (result) {
                    if (result instanceof Error) {
                        console.error('Error:', result.message);
                        sendGeneralFailure();
                        return false;
                    } else {
                        res.json(result);
                    }
                });
            }
        });

        /* GET /api/:resource */
        router.get('/api/:resource/:subresource', function (req, res) {
            var sendGeneralFailure = function(){
                var err = new Error('Not Found');
                err.status = 404;
                //next(err);
                res.end();
                return false;
            };

            if(_.isEmpty(req.params) || _.isEmpty(req.params.resource)) sendGeneralFailure();
            if(_.isEmpty(req.params) || _.isEmpty(req.params.subresource)) sendGeneralFailure();

            /** Vehicle Guide API */

            /* GET /api/vehicle */
            if(req.params.resource.toLowerCase() == 'vehicle'){

                if(req.params.subresource.toLowerCase() == 'years') {
                    return VehicleGuideRepository.getVehicleYears(function (result) {
                        if (result instanceof Error) {
                            console.error('Error:', result.message);
                            sendGeneralFailure();
                        } else {
                            res.json(result);
                        }
                    });
                }

                if(req.params.subresource.toLowerCase() == 'makes') {
                    if(typeof req.query.year === 'undefined') {
                        sendGeneralFailure();
                        return false;
                    }
                    return VehicleGuideRepository.getVehicleMakes(req.query.year, function (result) {
                        if (result instanceof Error) {
                            console.error('Error:', result.message);
                            sendGeneralFailure();
                        } else {
                            res.json(result);
                        }
                    });
                }

                if(req.params.subresource.toLowerCase() == 'models') {
                    if(typeof req.query.make === 'undefined' || typeof req.query.year === 'undefined' ) {
                        sendGeneralFailure();
                        return false;
                    }

                    return VehicleGuideRepository.getVehicleModels(req.query.year, req.query.make, function (result) {
                        if (result instanceof Error) {
                            console.error('Error:', result.message);
                            sendGeneralFailure();
                            return false;
                        } else {
                            res.json(result);
                        }
                    });
                }
            }
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