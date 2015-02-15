/**
 * @file Vehicle retrieval service for Vehicle Guide.
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */

Bluebird.service('Bluebird.Services.Vehicles', [
    '$resource',
    '$localStorage', 'moment', '_',
    function VehicleCollection($resource, $storage, moment, _){
        var VehicleYears = $resource('/api/vehicle/years');
        var VehicleMakes = $resource('/api/vehicle/makes', { year: '@year' });
        var VehicleModels = $resource('/api/vehicle/models', { year: '@year', make: '@make' });
        var Vehicle = $resource('/api/vehicle', { year: '@year', make: '@make', model: '@model', trim: '@trim' });

        /**
         * Retrieves a Vehicle in its raw form from the service.
         * @param next A callback function to perform when request is complete.
         * @param year Year of vehicle's manufacture.
         * @param make Make of the vehicle.
         * @param model Model of the vehicle.
         * @param [trim] Trim of the vehicle.
         */
        this.getRawVehicle = function(next, year, make, model, trim){

            // Simple check routine to ensure proper params passed.
            var isInvalid = function(param) {
                return  typeof param === 'undefined' ||
                        typeof param !== 'undefined'
                            && !(_.isString(param) || _.isNumber(param));
            };

            // Calls to method need to pass a valid year, make and model.
            if(isInvalid(year) || isInvalid(make) || isInvalid(model)) return false;

            /** Actions to perform on a successful API Call */
            var internalCallback = function(requestResult){
                // @todo: perform internal caching
            };

            // Create Request
            var vehicleRequest = new Vehicle({ year: year, make: make, model: model, trim: trim });

            // Perform Request
            vehicleRequest.$get({}, function Success(result){

                internalCallback(result);
                next(result);

            }, function Error(result){
                // @todo: perform error actions here
            });
        };

        /**
         * Retrieves a Vehicle from the service and cleans it of unused values.
         * @param next A callback function to perform when request is complete.
         * @param year Year of vehicle's manufacture.
         * @param make Make of the vehicle.
         * @param model Model of the vehicle.
         * @param [trim] Trim of the vehicle.
         * @todo currently bugged, need to correct algorithm
         */
        this.getVehicle = function(next, year, make, model, trim) {
            var wrappedCallback = _.wrap(next, function(originCallback, apiCallResult){

                // Recursion function to truncate empty values from Geek Squad Central
                function recurse(upperLevel){
                    _.each(upperLevel, function(lowerLevel, key, origin){
                        if(_.isArray(lowerLevel)) recurse(lowerLevel);
                        else if (_.isObject(lowerLevel) && !_.isEmpty(lowerLevel)) recurse(lowerLevel);
                        else {
                            if (_.isNull(lowerLevel) || lowerLevel == "") {
                                delete origin[key];
                            }
                        }

                        // Ckean up emptied objects
                        if(_.isObject(lowerLevel) && _.isEmpty(lowerLevel)){ delete origin[key]; }
                    });

                    return upperLevel;
                }

                if(typeof result.vehicle !== 'undefined'){
                    // Truncate empty values and return to original callback
                    apiCallResult.vehicle = recurse(apiCallResult.vehicle);
                }

                originCallback(apiCallResult);
            });

            // Rebuild arguments to pass to member method getVehicle()
            var args = _.union([wrappedCallback], _.rest(arguments, 1));

            this.getRawVehicle.apply(this, args);

        }
    }
]);