(function (angular) {
    "use strict";
    angular.module('cwm')
        .filter('byName', ByNameFilter);

    function ByNameFilter($rootScope, $q) {
        return function (items, query) {
            if (query === "") {
                return items;
            }
            return _.filter(items, function (item) {
                return  (item.leftUser.name.toLowerCase().indexOf(query.toLowerCase()) > -1) ||
                    (item.rightUser.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
            })
        };

    }

})(angular);