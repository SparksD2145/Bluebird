/**
 * @file Vehicle Fit Guide Repository
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */

var rest = require('restler'),
    moment = require('moment');

/**
 * Handles retrieving information from the vehicle fit guide, which is powered by Geek Squad Central.
 * @param app Origin application passed to the repository for configuration.
 * @constructor
 */
function VehicleGuideRepository(app){
    if(!app){
        throw new Error('The application was not passed to the Vehicle Guide Repository.');
    }

    this.app = app;
    this.debug = app.get('debug')('VehicleGuideRepository');
    this.url = app.get('config').vehicleGuide.url;
}

VehicleGuideRepository.prototype.getVehicle = function(year, make, model, trim, next){
    var apiUrl = this.url;
    var queryParameters = {
        year: year,
        make: make,
        model: model
    };

    if(trim){
        queryParameters.trim = trim;
    }

    rest.get(apiUrl, {
        query: queryParameters
    }).on('success', function(result){
        next(result);
    });

};

VehicleGuideRepository.prototype.getVehicleModels = function(year, make, next){
    var apiUrl = this.url;

    rest.get(apiUrl, {
        query: {
            year: year,
            make: make
        }
    }).on('success', function(result){
        next(result);
    });
};

VehicleGuideRepository.prototype.getVehicleMakes = function(year, next){
    var apiUrl = this.url;

    rest.get(apiUrl, {
        query: {
            year: year
        }
    }).on('success', function(result){
        next(result);
    });
};

VehicleGuideRepository.prototype.getVehicleYears = function(next){
    var apiUrl = this.url;

    rest.get(apiUrl).on('success', function(result){
        next(result);
    });
};

module.exports = VehicleGuideRepository;