'use strict';

angular.module('crunchinatorApp.directives').directive(
    'crTwitterShare',
    function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function(){
                    var shortened = encodeURIComponent(scope.$parent.shortUrl),
                        url = 'https://twitter.com/share?url=' + shortened;

                    window.open(url, 'Twitter', 'width=575,height=400');
                });
            }
        };
    }
);
