angular.module('SB.directives',[]).directive('ngNicescroll',function($parse){
    return {
        restrict:'A',
        scope:true,
        link:function(scope,element,attr){
            var m=$parse(attr.nsOptions);
            var options=m(scope)||{};
            element.niceScroll(options);
        }
    }
}).directive('ngNewgroup', ['$document', '$http','sbInfo', function ($document, $http,sbInfo) {
    return {
        restrict: 'A',
        templateUrl:'/jade/newgroup',
        link: function (scope, element, attrs) {
            scope.newgroup.newValue='';
            scope.newgroup.confirm = function () {
                if (scope.newgroup.newValue.length) {
                    var post={
                        key:scope.newgroup.key,
                        value:{
                            display: scope.newgroup.newValue
                        }
                    };
                    $http.post('/data/users/newgroup/self', post).success(function (res) {
                        post.value.groupId=res;
                        post.value.number=0;
                        sbInfo.info[scope.newgroup.key].push(post.value);
                        scope.newgroup.newValue = '';
                        if(scope.newgroup.hideCancel){
                            scope.newgroup.cancel();
                        }
                    });
                } else {
                    scope.newgroup.cancel();
                }
            }
            scope.newgroup.cancel = function () {
                scope.newgroup.newValue = '';
                scope.newgroup.input = false;
                $document.trigger('click');
            }
            element.click(function (e) {
                e.stopPropagation();
            });
        }
    }
}]);