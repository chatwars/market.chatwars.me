(function(angular){
    "use strict";
    angular.module('cwm')
        .directive('profileLink', profileLinkDirective)
        .controller('profileLinkController', profileLinkController);

    function profileLinkController($rootScope) {
        var ctrl = this;
        var type = '.svg';
        var flag = _.chain(ctrl.profile).get('castle').lowerCase().value();
        ctrl.path = "/img/" + _.get($rootScope.flags, flag) + type;
        ctrl.userName = ctrl.profile.name;
        ctrl.userId = _.get(ctrl.profile, 'id', '');
    }

    function profileLinkDirective(){
        return {
            restrict: "A",
            scope: {
                profile: "=profileLink"
            },
            template: "<md-icon class='emoji' md-svg-src='{{ vm.path }}'></md-icon> <a ui-sref='cwm.profile({hash: vm.userId})'>{{vm.userName}}</a>",
            controller: 'profileLinkController',
            controllerAs: 'vm',
            bindToController: true,
            link: linkFn
        };

        function linkFn(scope, elem, attrs){

        }
    }

})(angular);