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
                    .state('cwm.logs', {
                        url: "/logs/:id",
                        views: {
                            'content@cwm': {
                                templateUrl: 'index/index.html',
                                controller: 'indexCtrl',
                                controllerAs: 'vm'
                            }
                        }
                    })
                    .state('cwm.profile', {
                        url: "/profile/:username",
                        views: {
                            'content@cwm': {
                                templateUrl: 'profile/profile.html',
                                controller: 'profileCtrl',
                                controllerAs: 'vm'
                            }
                        }
                    });

                $urlRouterProvider.otherwise('/logs/');
            });

        angular.bootstrap(document, ['cwm']);
    });


    angular
        .module('cwm', [
            'ui.router', 'restangular', 'ngStorage', 'ngSanitize', 'ngMaterial',
            'ngResource', 'ngMessages', 'ngclipboard', 'md.data.table', 'cfp.loadingBar',
            'cwm.templates'
        ])
        .run(function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.flags = {
                "🇨🇾": "1f1e8-1f1fe", // White
                "🇻🇦": "1f1fb-1f1e6", // Yellow
                "🇮🇲": "1f1ee-1f1f2", // Red
                "🇪🇺": "1f1ea-1f1fa", // Blue
                "🇬🇵": "1f1ec-1f1f5", // Black
            }
        })
})();