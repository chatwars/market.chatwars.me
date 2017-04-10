(function (angular) {
    "use strict";
    angular.module('cwm')
        .filter('udate', UdateFilter);

    function UdateFilter() {
        return function (stamp) {
            var convert = function(val) {
                if (val.toString().length == 1) {
                    return "0" + val;
                } else {
                    return val;
                }
            };

            var a = new Date(stamp * 1000);
            var months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = convert(a.getHours());
            var min = convert(a.getMinutes());
            var sec = convert(a.getSeconds());
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
            return time;
        };



    }

})(angular);