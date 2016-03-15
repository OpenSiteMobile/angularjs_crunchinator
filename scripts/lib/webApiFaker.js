'use strict';

(function (ng) {
    var injector = ng.injector(['configuration', 'ng']);
    var environment = injector.get('ENV');
    var api_version = injector.get('API_VERSION');
    var base_url = '';

    switch (environment) {
    case 'staging':
        base_url = 'http://staging.crunchinator.com/api/' + api_version;
        break;
    case 'production':
        base_url = 'http://crunchinator.com/api/' + api_version;
        break;
    }

    ng.module('crunchinatorApp.models').constant('API_BASE_URL', base_url);
})(angular);
