(function(angular){
    "use strict";
    angular.module('cwm')
        .service('StaticService', StaticService);

    function StaticService($http, $location){
        var service = {};

        service.trades = function(id) {
            return $http.get('json/trades.json');
        };

        service.logs = function() {
            var path = ($location.host() == 'localhost') ?
                'json/logs.json' :
                '/export/lastWeek.json';

            return $http.get(path);
        };

        return service;
    }

})(angular);