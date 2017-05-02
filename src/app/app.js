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
                        url: "/profile/:hash",
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
                "white": "1f1e8-1f1fe", // White
                "yellow": "1f1fb-1f1e6", // Yellow
                "red": "1f1ee-1f1f2", // Red
                "blue": "1f1ea-1f1fa", // Blue
                "black": "1f1ec-1f1f5", // Black
                "mint": "1f1f2-1f1f4", // Mint
                "twilight": "1f1f0-1f1ee" // Twilight
            }
        })
})();