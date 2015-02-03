/**
 * @file Vehicle Guide start page
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */
Bluebird.States['VehicleGuideSelection'] = {
    name: 'vehicleGuideSelection',
    templateUrl: 'vehicle-guide/vehicle-selection/vehicle-selection',
    url: '/vehicle-guide/selection',
    controller: [
        '$scope', '$resource',
        '$state', '$stateParams',
        function($scope, $resource, $state, $stateParams){

            $scope.vehicleMakes = function(){
                var year = $scope.yearSelected;
                $scope.makeSelected = null;
                $scope.modelSelected = null;

                if(year != ""){
                    $scope.makesLoading = true;
                    $scope.makes = null;
                    $scope.models = null;

                    $resource('/api/vehicle/makes').get({
                        year: year
                    }, function(result){
                        $scope.makes = result.makes;
                        $scope.makesLoading = false;
                    });
                }
            };

            $scope.vehicleModels = function(){
                var make = $scope.makeSelected;
                var year = $scope.yearSelected;

                $scope.modelSelected = null;

                if(year != ""){
                    $scope.models = null;
                    $scope.modelsLoading = true;

                    $resource('/api/vehicle/models').get({
                        year: year,
                        make: make
                    }, function(result){
                        $scope.models = result.models;
                        $scope.modelsLoading = false;
                    });
                }
            };

            $scope.getVehicle = function(){
                $state.go('vehicleGuideDetails', {
                    year: $scope.yearSelected,
                    make: $scope.makeSelected,
                    model: $scope.modelSelected
                });
            };

            if(!_.isEmpty($stateParams) && $stateParams.year && $stateParams.make && $stateParams.model) {
                $scope.yearSelected = $stateParams.year;
                $scope.makeSelected = $stateParams.make;
                $scope.modelSelected = $stateParams.model;

                $scope.getVehicle();
            }

            // Retrieve Years
            $resource('/api/vehicle/years').get({}, function(result){
                $scope.years = result["years"];
            });
        }
    ]
};