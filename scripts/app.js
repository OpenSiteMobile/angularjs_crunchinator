'use strict';

angular.module('crunchinatorApp.models', []);
angular.module('crunchinatorApp.directives', []);
angular.module('crunchinatorApp.services', []);

angular.module('crunchinatorApp.controllers', [
    'ui.router', 'ui.bootstrap',
    'configuration',
    'crunchinatorApp.models', 'crunchinatorApp.directives', 'crunchinatorApp.services',
    'infinite-scroll',
]).config(
    function config($stateProvider) {
        $stateProvider.state(
            'crunchinator',
            {
                url: '/crunchinator',
                views: {
                    main: {
                        controller: 'CrunchinatorCtrl',
                        templateUrl: 'views/main.tpl.html'
                    },
                    about: {
                        controller: 'AboutCtrl',
                        templateUrl: 'views/about.tpl.html'
                    }
                },
                data:{ pageTitle: 'Crunchinator - A Cloudspace Project' }
            }
        );
    }
);

angular.module(
    'crunchinatorApp',
    ['ui.router', 'crunchinatorApp.controllers']
).config(
    function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise( '/crunchinator' );
    }
).run(
    function run() {}
).controller(
    'AppCtrl',
    function AppCtrl($scope, $location) {

        $scope.isMobile = msos.config.browser.mobile;
        $scope.shared_results = !!$location.search().filters;

        $scope.$on(
            '$stateChangeSuccess',
            function (event, toState){
                if (angular.isDefined(toState.data.pageTitle)) {
                    $scope.pageTitle = toState.data.pageTitle;
                }
            }
        );

        if ($scope.isMobile) {
            angular.element('html, body').css({ 'overflow': 'visible' });
        }
    }
);

angular.module("configuration", [])
    .constant("ENV", "production")
    .constant("API_VERSION", "v1.3.0")
    .constant("BITLY_KEY", "98766bc61a09e3d4cd9c5d16dae3b2b604f97a98");

(function (ng) {
    var injector = ng.injector(['configuration', 'ng']),
        environment = injector.get('ENV'),
        api_version = injector.get('API_VERSION'),
        base_url = '';

    switch (environment) {
        case 'staging':
            base_url = 'http://staging.crunchinator.com/api/' + api_version;
        break;
        case 'production':
            base_url = 'http://crunchinator.com/api/' + api_version;
        break;
    }

    ng.module('crunchinatorApp.models').constant('API_BASE_URL', base_url);

}(angular));