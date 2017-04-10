(function(angular){
    "use strict";
    angular.module('cwm')
        .controller('headerCtrl', HeaderCtrl)
        .controller('containerCtrl', ContainerCtrl);

    function HeaderCtrl($scope, $mdSidenav){
        var ctrl = this;

        ctrl.toggleSidenav = function () {
            $mdSidenav('left').toggle();
        };

    }

    function ContainerCtrl($scope, $mdSidenav){
        var ctrl = this;

        ctrl.toggleSidenav = function () {
            $mdSidenav('left').toggle();
        };

    }

})(angular);