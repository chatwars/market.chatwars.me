;
(function () {
    "use strict";

    angular.element(document).ready(function () {
        angular.module('cwm')
            .config(function ($locationProvider, $stateProvider, $urlRouterProvider, $qProvider, cfpLoadingBarProvider, $mdThemingProvider, $mdDialogProvider) {
                $locationProvider.html5Mode(true).hashPrefix('!');
                cfpLoadingBarProvider.includeSpinner = true;
                cfpLoadingBarProvider.includeBar = true;
                cfpLoadingBarProvider.parentSelector = '#loading-bar-container';

                $stateProvider
                    .state('cwm', {
                        views: {
                            '@': {
                                templateUrl: 'template/container.html',
                                controller: 'containerCtrl',
                                controllerAs: 'vm'
                            },
                            'header@cwm': {
                                templateUrl: 'header/header.html',
                                controller: 'headerCtrl',
                                controllerAs: 'vm'
                            },
                            'footer@cwm': {
                                templateUrl: 'template/footer.html'
                            }
                        }
                    })
                    .state('cwm.index', {
                        url: "/:id",
                        views: {
                            'content@cwm': {
                                templateUrl: 'index/index.html',
                                controller: 'indexCtrl',
                                controllerAs: 'vm'
                            }
                        }
                    });

                $urlRouterProvider.otherwise('/');
            });

        angular.bootstrap(document, ['cwm']);
    });


    angular
        .module('cwm', [
            'ui.router', 'restangular', 'ngStorage', 'ngSanitize', 'ngMaterial',
            'ngResource', 'ngMessages', 'md.data.table', 'cfp.loadingBar',
            'cwm.templates'
        ])
        .run(function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        })
})();