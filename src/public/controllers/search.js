/**
 * @file Navbar Search Controller
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */

/**
 * Controller handling navbar-based search functionality.
 */
Bluebird.controller('Bluebird.Controllers.Search', [
    '$scope', '$location',
    function($scope, $location){
        /** Navbar's current contents serve as the model for search queries. */
        $scope.searchQuery = '';

        /** Set's the navbar search input's placeholder. */
        $scope.placeholder = 'Product Search';

        /** Clears navbar search input's value */
        $scope.clearSearch = function(){
            $scope.searchQuery = '';
        };

        /** Performs search from navbar on submit. */
        $scope.handleSearch = function(){
            if(!_.isEmpty($scope.searchQuery)) {

                // Clone the searchQuery model. Useful if we have to perform string functions,
                // but those string functions should really be handled on the server side.
                var query = $scope.searchQuery;

                // Navigate to search state.
                $location.path('/search/' + query );
            }
        };

        $scope.openSidebar = function(){
            angular.element('#sidebar').toggleClass('open');
        };
    }
]);

/**
 * Directive handling dismissal of search focused keyboard
 */
Bluebird.directive("touchDismissSearch", function () {
    return function(scope, element) {
        element.on("touchstart", function() {
            angular.element('[ng-controller="Bluebird.Controllers.Search"] [type=search]').blur();
        });
    };
});