/** @file Home Page */

Bluebird.States['Home'] = {
    name: 'home',
    templateUrl: 'home/home',
    url: '/',
    controller: [
        '$scope',
        function($scope){
            var quotes = [
                "Searching should always be this easy.",
                "Great Scott!",
                'An unusual game. The only winning search is not to struggle.',
                "Searching whole countries with the cunning use of flags.",
                Array(16).join(("piderman" - 1) + " ") + 'Searchman!',
                "Make it search, Number One.",
                "Search into Maximum Overdrive.",
                "\"The following is classified, level Rho.\"",
                "The search is palpable. (famous last words)",
                "I was out of queries.",
                "Come with me if you want to search.",
                "Search up a Bluebird Special."
            ];

            var where = Math.floor(Math.random() * quotes.length);
            $scope.quote = quotes[where];
        }
    ]
};