angular.module('SB.services',['ngResource']).factory('sbInfo',['$http',function($http){
    var obj={};
    obj.info=null;
    obj.get=function(){
        return $http({
            url: '/data/users/info/self',
            method: 'GET'
        });
    }
    return obj;
}]).factory('rest',['$resource',function($resource){
    return {
        // index: $resource('/api/index/:OP'),
        // user: $resource('/api/user/:ID/:OP'),
        // article: $resource('/api/article/:ID/:OP'),
        // tag: $resource('/api/tag/:ID/:OP')
    };
}]);