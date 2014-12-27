/**
 * @file Navbar Search Controller
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */

/**
 * Controller handling navbar-search functionality.
 */
Bluebird.controller('Bluebird.Controllers.Search', [
    '$scope', '$state',
    function($scope, $state){
        $scope.searchQuery = '';
        $scope.placeholder = 'Search';

        $scope.clearSearch = function(){
            $scope.searchQuery = '';
        };

        $scope.handleSearch = function(){
            if(!_.isEmpty($scope.searchQuery)) {
                $state.go('search', { query: $scope.searchQuery });
            }
        }
    }
]);