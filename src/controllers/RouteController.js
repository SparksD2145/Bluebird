/**
 * @file RouteController controller.
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */

/**
 * Handles URL addressing and processing.
 * @requires module:express
 * @requires module:underscore
 * @type {exports}
 * @returns {object}
 */
function RouteController(app) {

    /** Initialize instance of Express.Router for routing operations */
    var router = require('express').Router();
    var _ = require('underscore');

    /** Require ProductRepository for product operations */
    var ProductRepository = require('../repositories/product/productRepository');
    ProductRepository = new ProductRepository(app);

    /** Registers URL Route Parameters with Application */
    (function DefineRouteParameters(){
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
            next();
        });
    })();

    /** Registers URL Routes with Application */
    (function DefineRoutes() {

        /* GET /:state/*name */
        router.get('/state/*', function (req, res) {
            var pageStorageUrlPrefix = 'public/states/';

            if(_.isEmpty(req.params[0])) {
                var err = new Error('Not Found');
                err.status = 404;
                next(err);
                return false;
            }

            var state = pageStorageUrlPrefix + req.params[0];
            res.render(state, {
                devmode: app.get('env') === 'development'
            });
        });

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


            if(req.params.type.toLowerCase() == 'product'){
                // useExtendedSearch is of type String due to constraints of string to boolean conversion.
                var useExtendedSearch = 'false';

                if (!_.isEmpty(req.query) && !_.isEmpty(req.query.extendedSearch))
                    useExtendedSearch = req.query.extendedSearch === 'true';

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

        /* GET / */
        router.all('/*', function(req, res) {
            res.render('views/master', {
                title: app.get('config').application.name,
                devmode: app.get('config').application.developmentMode,
            });
        });
    })();

    return router;
}
module.exports = RouteController;