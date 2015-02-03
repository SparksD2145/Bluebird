/**
 * @file Vehicle Guide start page
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */
Bluebird.States['VehicleGuideDetails'] = {
    name: 'vehicleGuideDetails',
    templateUrl: 'vehicle-guide/vehicle-details/vehicle-details',
    url: '/vehicle-guide/details/:year/:make/:model',
    controller: [
        '$scope', '$resource',
        '$stateParams',
        function($scope, $resource, $stateParams){


            $scope.getVehicle = function(){
                var make = $scope.makeSelected;
                var year = $scope.yearSelected;
                var model = $scope.modelSelected;

                $scope.vehicleLoading = true;

                $resource('/api/vehicle').get({
                    year: year,
                    make: make,
                    model: model
                }, function(result){
                    $scope.vehicle = result.vehicle ;
                    $scope.vehicleLoading = false;
                });
            };

            if(!_.isEmpty($stateParams) && $stateParams.year && $stateParams.make && $stateParams.model) {
                $scope.yearSelected = $stateParams.year;
                $scope.makeSelected = $stateParams.make;
                $scope.modelSelected = $stateParams.model;

                $scope.getVehicle();
            }
        }
    ]
};