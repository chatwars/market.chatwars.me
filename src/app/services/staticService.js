(function(angular){
    "use strict";
    angular.module('cwm')
        .service('StaticService', StaticService);

    function StaticService($http){
        var service = {};

        service.local = function(id) {
            return $http.get('json/logs.json');
        };

        service.full = function() {
            return $http.get('/export/lastWeek.json');
        };

        return service;
    }

})(angular);