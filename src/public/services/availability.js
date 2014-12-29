/**
 * @file Products Collection source file.
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */

Bluebird.service('Bluebird.Services.Availability', [
    '$resource', 'geolocation',
    '_', 'Modernizr',
    function ProductCollection($resource, geolocation, _, modernizr){
        /**
         * Internal storage for products within the collection.
         * @type {Array}
         * @internal
         */
        var storesStored = [];

        /** Products API */
        var api = $resource('/api/availability/:query');

        /**
         * Add a store to the collection
         * @param store A store to add to the collection.
         * @returns {*}
         */
        this.add = function(store){
            // Didn't pass one? Don't add one.
            if(_.isUndefined(store)) return false;

            // If the developer passes an Array of Products, handle gracefully.
            if(_.isArray(store)){
                // Add only products that have not been added prior
                return storesStored = _.union(storesStored, store);
            } else {
                storesStored.save(store);
                return storesStored;
            }
        };

        /**
         * Remove a store from the collection
         * @param store A store to add to the collection.
         * @returns {*}
         */
        this.remove = function(store){
            // Didn't pass one? Don't add one.
            if(_.isUndefined(store)) return false;

            var deleteSingle = function(singleProduct) {

                // If the developer passes a Number, assume it represents the _id of the Product.
                // Otherwise, treat as a Product instance.
                if (_.isNumber(singleProduct)) {

                    return storesStored = _.without(storesStored, _.findWhere(storesStored, { _id: store }));

                } else {
                    if (_.isUndefined(singleProduct._id)) return false;
                    return storesStored = _.without(storesStored, singleProduct);
                }
            };

            if(_.isArray(store)){ return storesStored = _.difference(storesStored, store); }
            else { return deleteSingle(store); }
        };

        /**
         * Finds a product within the collection.
         * @param product A product to search for.
         * @returns {*}
         */
        this.find = function(product){
            // Didn't pass one? Don't add one.
            if(_.isUndefined(product)) return null;

            // If the developer passes a Number, assume it represents the _id of the Product.
            // Otherwise, treat as an object instance we can search with.
            if (_.isNumber(product)) {
                return _.findWhere(storesStored, { storeId: product });

            } else {
                if (!_.isObject(product)) return false;
                return _.where(storesStored, product);
            }
        };

        this.query = function(query, callback) {
            var internalCallback = function(result) {
                // this.add(result); // @todo add caching to availability
                return callback(result);
            }.bind(this);


            var location = 78232;

            if(modernizr.geolocation){
                geolocation.getLocation().then(function(geoposition){
                    location = geoposition.coords.latitude + ',' + geoposition.coords.longitude;

                    var args = [
                        {
                            query: query,
                            location: location
                        }, function (products) {
                            internalCallback(products);
                        }
                    ];
                    api.query.apply(this, args);
                })
            } else {
                var args = [
                    {
                        query: query,
                        location: location
                    }, function (products) {
                        internalCallback(products);
                    }
                ];
                api.query.apply(this, args);
            }

        };
    }
]);