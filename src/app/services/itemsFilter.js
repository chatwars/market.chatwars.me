(function (angular) {
    "use strict";
    angular.module('cwm')
        .filter('items', ItemsFilter);

    function ItemsFilter($rootScope, $q) {
        return function (items, query, logic) {
            if (_.isArray(query) && query.length > 0) {
                var stock;
                return _.filter(items, function (item) {
                    stock = _.chain([]).concat(_.keys(item.leftToRight), _.keys(item.rightToLeft)).uniq();
                    if (logic) { // И
                        return (_.difference(query, stock.value()).length === 0) ? item : false;
                    } else { // ИЛИ
                        return (_.intersection(query, stock.value()).length > 0) ? item : false;
                    }
                });
            } else {
                return items;
            }
        };

    }

})(angular);