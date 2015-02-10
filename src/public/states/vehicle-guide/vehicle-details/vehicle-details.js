/**
 * @file Vehicle Guide start page
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */
Bluebird.States['VehicleGuideDetails'] = {
    name: 'vehicleGuideDetails',
    templateUrl: 'vehicle-guide/vehicle-details/vehicle-details',
    url: '/vehicle-guide/details/:year/:make/:model?trim',
    controller: [
        '$scope', '$resource',
        '$stateParams', '_',
        'Bluebird.Services.Vehicles',
        function($scope, $resource, $stateParams, _, vehicles){


            $scope.getVehicle = function(){
                var year = $scope.yearSelected;
                var make = $scope.makeSelected;
                var model = $scope.modelSelected;
                var trim = $scope.trimSelected;

                $scope.vehicleLoading = true;

                vehicles.getVehicle(function(result){

                    // @todo: Ensure this is what is actually returned, and error handling
                    $scope.vehicle = result;
                    $scope.vehicleLoading = false;

                }, year, make, model, trim);

            };

            if(!_.isEmpty($stateParams) && $stateParams.year && $stateParams.make && $stateParams.model) {
                $scope.yearSelected = $stateParams.year;
                $scope.makeSelected = $stateParams.make;
                $scope.modelSelected = $stateParams.model;
                $scope.trimSelected = $stateParams.trim;

                $scope.getVehicle();
            }
        }
    ]
};