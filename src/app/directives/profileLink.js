(function(angular){
    "use strict";
    angular.module('cwm')
        .directive('profileLink', profileLinkDirective)
        .controller('profileLinkController', profileLinkController);

    function profileLinkController($rootScope) {
        var ctrl = this;
        var type = '.svg';
        var name = ctrl.profile.name.match(/([🇨🇾|🇻🇦|🇮🇲|🇪🇺|🇬🇵]{4}) (.*)/);

        ctrl.flag = "/img/" + _.get($rootScope.flags, name[1]) + type;
        ctrl.userName = _.trim(name[2]);
    }

    function profileLinkDirective(){
        return {
            restrict: "A",
            scope: {
                profile: "=profileLink"
            },
            template: "<md-icon class='emoji' md-svg-src='{{ vm.flag }}'></md-icon> <a ui-sref='cwm.profile({user: vm.userName})'>{{vm.userName}}</a>",
            controller: 'profileLinkController',
            controllerAs: 'vm',
            bindToController: true,
            link: linkFn
        };

        function linkFn(scope, elem, attrs){

        }
    }

})(angular);