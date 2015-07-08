var SB = angular.module('smartBadge', ['ngRoute', 'ngGrid', 'SB.controllers', 'SB.services', 'SB.directives', 'ui.bootstrap', 'ui.sortable', 'ngTagsInput']);

SB.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/contacts/upload', {
            templateUrl: '/app/contacts/upload',
            controller: 'uploadCtrl'
        }).when('/contacts/add', {
            templateUrl: '/app/contacts/add',
            controller: 'addCtrl'
        }).when('/contacts', {
            templateUrl: '/app/contacts',
            controller: 'contactsListCtrl'
        }).when('/contacts/detail', {
            templateUrl: function(query) {
                var url = '/app/contacts/detail?';
                for (var k in query) {
                    url += k + '=' + query[k] + '&';
                }
                return url.substring(0, url.length - 1);
            },
            controller: 'detailCtrl'
        }).when('/meeting', {
            templateUrl: '/app/meeting',
            controller: 'meetingCtrl'
        }).when('/expos', {
            templateUrl: '/app/expos',
            controller: 'exposCtrl'
        }).when('/settings', {
            templateUrl: '/app/settings',
            controller: 'settingsCtrl'
        }).otherwise({
            redirectTo: '/contacts'
        });
        $locationProvider.html5Mode('true');
    }
]).run(['$rootScope', '$location', '$window', '$http', 'sbInfo',
    function($rootScope, $location, $window, $http, sbInfo) {
        sbInfo.get().success(function(res) {
            sbInfo.info = res.info;
        });
        $rootScope.path = $location.path();
        $rootScope.$on('$routeChangeSuccess', function(newValue) {
            $rootScope.path = $location.path();
        });
        $rootScope.logout = function() {
            $window.location.href = '/app/sign/logout';
        }
        $rootScope.downloadList = function() {
            $window.location.href = '/data/contacts/download';
        }
    }
]);