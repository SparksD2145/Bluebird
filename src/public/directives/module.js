/**
 * @file RSSNavigator.Core.Directives.Module
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */
Bluebird.Core.Directives.Module = Bluebird.directive('module', function(){
    return {
        templateUrl: '',
        transclude: false,
        restrict: 'E',
        scope: {},
        controller: [
            '$scope',
            function($scope){

            }
        ]
        //require: null,
        //controllerAs: null
    }
});