/**
 * @file Products Collection source file.
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */

Bluebird.service('Bluebird.Services.Products', [
    '$resource',
    '_',
    function ProductCollection($resource, _){
        /**
         * Internal storage for products within the collection.
         * @type {Array}
         * @internal
         */
        var productsStored = [];

        /** Products API */
        var api = $resource('/api/product/:query');

        /**
         *
         * @param product A product to add to the collection.
         * @returns {*}
         */
        this.add = function(product){
            // Didn't pass one? Don't add one.
            if(_.isUndefined(product)) return false;

            // If the developer passes an Array of Products, handle gracefully.
            if(_.isArray(product)){
                // Add only products that have not been added prior
                return productsStored = _.union(productsStored, product);
            } else {
                productsStored.save(product);
                return productsStored;
            }
        };

        this.remove = function(product){
            // Didn't pass one? Don't add one.
            if(_.isUndefined(product)) return false;

            var deleteSingle = function(singleProduct) {

                // If the developer passes a Number, assume it represents the _id of the Product.
                // Otherwise, treat as a Product instance.
                if (_.isNumber(singleProduct)) {

                    return productsStored = _.without(productsStored, _.findWhere(productsStored, { _id: product }));

                } else {
                    if (_.isUndefined(singleProduct._id)) return false;
                    return productsStored = _.without(productsStored, singleProduct);
                }
            };

            if(_.isArray(product)){ return productsStored = _.difference(productsStored, product); }
            else { return deleteSingle(product); }
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
                return _.findWhere(productsStored, { _id: product });

            } else {
                if (!_.isObject(product)) return false;
                return _.where(productsStored, product);
            }
        };

        this.query = function(query, extendedSearch, callback) {
            var internalCallback = function(result) {
                this.add(result);
                return callback(result);
            }.bind(this);

            var args = [
                {
                    query: query,
                    extendedSearch: extendedSearch
                }, function(products){
                    internalCallback(products);
                }
            ];

            api.query.apply(this, args);
        };
    }
]);