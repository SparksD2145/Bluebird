/**
 * @file Bluebird.Components.Page Class
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */
Bluebird.provider('Bluebird.States', function StatesCollectionProvider(){
    if(typeof Bluebird.States === 'undefined') console.error(new ReferenceError("Bluebird.States collection is missing."));

    var statesCollection = [];

    function State(config){
        var configTemplate = {
            name: undefined,
            template: undefined,
            templateUrl: undefined,
            templateProvider: undefined,
            controller: undefined,
            controllerProvider: undefined,
            controllerAs: undefined,
            parent: undefined,
            resolve: undefined,
            url: undefined,
            views: undefined,
            abstract: undefined,
            onEnter: undefined,
            onExit: undefined,
            reloadOnSearch: undefined,
            data: undefined,
            params: undefined
        };

        _.extend(this, configTemplate, config);
    }

    this.compile = function(){
        // Empty States Collection.
        statesCollection = [];

        _.each(Bluebird.States, function(stateObj){
            var state = new State(stateObj);

            state.templateUrl = _.isString(state.templateUrl)?
            'state/' + state.templateUrl :
            state.templateUrl;

            statesCollection.push(state);
        }, this);

        return this;
    };

    this.getCollection = function(){ return statesCollection; };

    this.$get = function(){
        return this;
    };
});