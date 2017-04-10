(function (angular) {
    "use strict";
    angular.module('cwm')
        .filter('emoji', EmojiFilter);

    function EmojiFilter() {
        return function (item) {
            return twemoji.parse(item);
        };

    }

})(angular);