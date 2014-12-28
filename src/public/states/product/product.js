/** @file Product Page */

Bluebird.States['Product'] = {
    name: 'product',
    controller: [
        '$scope', '$stateParams', '$resource',
        '_',
        'Bluebird.Services.Products', 'Bluebird.Services.Availability',
        function($scope, $stateParams, $resource, _, Products, Availability){

            var rebuildProduct = function(product){
                if (product.descriptions) {
                    product.descriptions.longDescription = _.unescape(product.descriptions.longDescription);
                }

                if (product.savings.percentSavings) {
                    product.savings.percentSavings = parseFloat(product.savings.percentSavings).toFixed(0);
                }

                if (product.availability.releaseDate) {
                    product.availability.releaseDate = moment(product.availability.releaseDate).calendar();

                    var invalidDateRegex = /invalid date.?/i;
                    product.availability.releaseDateValid = !invalidDateRegex.test(product.availability.releaseDate);
                }

                Availability.query(product.identifiers.sku, function(stores){
                    product.stores = stores;
                    product.availability.anyStores = !_.isEmpty(product.stores);

                    $scope.product = product;
                    $scope.isLoaded = true;

                    return product;
                });

            };

            if($stateParams){
                try {
                    $stateParams.query = parseInt($stateParams.query);
                } catch (err){
                    console.error(err);
                }

                var product = Products.find($stateParams.query);

                if(!product){
                    Products.query($stateParams.query, false, function(prd){
                        var product = _.first(prd);

                        rebuildProduct(product);
                    });
                } else {

                    rebuildProduct(product);
                }

            }
        }
    ],
    templateUrl: 'product/product',
    url: '/product/:query'
};