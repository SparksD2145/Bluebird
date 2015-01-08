/**
 * @file Product Page
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */

Bluebird.States['Product'] = {
    name: 'product',
    controller: [
        '$scope', '$stateParams', '$resource',
        '_',
        'Bluebird.Services.Products', 'Bluebird.Services.Availability',
        function($scope, $stateParams, $resource, _, Products, Availability){

            // Rebuild product information to better display information to user
            var rebuildProduct = function(product){
                // Unescape the long description returned by the server.
                if (product.descriptions) {
                    product.descriptions.longDescription = _.unescape(product.descriptions.longDescription);
                }

                // Calibrate savings value to a no-decimal value.
                if (product.savings.percentSavings) {
                    product.savings.percentSavings = parseFloat(product.savings.percentSavings).toFixed(0);
                }

                // Format the product's release date, if available.
                if (product.availability.releaseDate) {
                    product.availability.releaseDate = moment(product.availability.releaseDate).calendar();

                    var invalidDateRegex = /invalid date.?/i;
                    product.availability.releaseDateValid = !invalidDateRegex.test(product.availability.releaseDate);
                }

                // Make review average useful and generate stars.
                if(product.reviews.customerReviewAverage) {
                    var size = Math.ceil(parseFloat(product.reviews.customerReviewAverage));

                    // Create stars
                    var stars = [];
                    for(var i = 1; i < size + 1; i++) {
                        stars.push(i);
                    }
                    product.reviews.reviewStars = stars;

                    // Create adjective
                    switch(size){
                        case 0:
                            product.reviews.adjective = 'quietly';
                            break;
                        case 1:
                            product.reviews.adjective = 'very poorly';
                            break;
                        case 2:
                            product.reviews.adjective = 'poorly';
                            break;
                        case 3:
                            product.reviews.adjective = 'adequately';
                            break;
                        case 4:
                            product.reviews.adjective = 'well';
                            break;
                        case 5:
                            product.reviews.adjective = 'exceptionally well';
                            break;
                    }
                }

                // Get product availability if it's available in stores.
                if(product.availability.hasInStoreAvailability){

                    if(Availability.canQuery()){
                        Availability.query(product.identifiers.sku, function(stores){

                            if(stores instanceof Error) {
                                // Geolocation service could not be utilized
                                $scope.showGeolocationError();
                            }

                            product.stores = stores;
                            product.availability.anyStores = !_.isEmpty(product.stores);

                            $scope.product = product;
                            $scope.isLoaded = true;

                            return product;
                        });
                    }

                } else {
                    product.availability.anyStores = false;

                    $scope.product = product;
                    $scope.isLoaded = true;

                    return product;
                }
            };

            // Load product.
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

            $scope.showGeolocationError = function(){
                $scope.geolocationUnavailable = true;
            };
            $scope.showProductNotFoundError = function(){
                $scope.productNotFound = true;
            };
        }
    ],
    templateUrl: 'product/product',
    url: '/product/:query'
};