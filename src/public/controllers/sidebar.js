/**
 * @file Sidebar Controller
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */

/**
 * Controller handling sidebar-based functionality.
 */
Bluebird.controller('Bluebird.Controllers.Sidebar', [
    '$scope',
    function($scope){
        $scope.closeSidebar = function(){
            angular.element('#sidebar').removeClass('open');
        }
    }
]);