'use strict';

angular.module('crunchinatorApp.directives').directive(
    'crEmailShare',
    function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.bind(
                    'click',
                    function () {
                        var shortened = encodeURIComponent(scope.$parent.shortUrl),
                            link = 'mailto:?body=' + shortened;

                        window.location.href = link;
                    }
                );
            }
        };
    }
);
