/**
 * @file Vehicle Guide landing page
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */
Bluebird.States['VehicleGuideStart'] = {
    name: 'vehicleGuide',
    templateUrl: 'vehicle-guide/start/vehicle-start',
    url: '/vehicle-guide',
    controller: [
        '$scope', '$state',
        function($scope, $state){
        }
    ]
};