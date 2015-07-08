var SB=angular.module('list',[]);

SB.run(['$rootScope',function($rootScope){

}]);

SB.controller('listCtrl',['$scope','$window',function($scope,$window){
    if($window.location.search.split('=').length>1){
        $scope.activeTab=parseInt($window.location.search.split('=')[1]);
    }else{
        $scope.activeTab=0;
    }
    $scope.tabs=[
        {id:0,display:'3D打印与增材制造设备'},
        {id:1,display:'原型制造与产品开发'},
        {id:2,display:'软件系统'},
        {id:3,display:'3D扫描与数字化模块'},
        {id:4,display:'3D打印耗材部分'},
        {id:5,display:'3D打印部件与其他服务'},
    ]
    $scope.results=[
        [
            {name:'阿科玛（中国）投资有限公司上海分公司',contact:'蔡凌云',time:'2015-3-12 8:10',mobile:'139********',tags:['FDM','SLA']},
            {name:'深圳市光华伟业实业有限公司',contact:'邢汉宾',time:'2015-3-12 9:21',mobile:'136********',tags:['SLM','SLA']},
            {name:'北京太尔时代科技有限公司',contact:'陈晓航',time:'2015-3-12 10:02',mobile:'139********',tags:['FDM','EBM']},
            {name:'深圳市齐乐模具科技有限公司',contact:'胡承伟',time:'2015-3-12 10:17',mobile:'136********',tags:['FDM','SLA','SLM']},
        ],[
            {name:'易欧司光电技术（上海）有限公司',contact:'李爱和',time:'2015-3-12 8:55',mobile:'131********',tags:['手板制作']},
        ],[]
        ,[
            {name:'广州随尔激光快速成型有限公司',contact:'缪正梅',time:'2015-3-12 13:55',mobile:'187********',tags:['3D CAD']},
        ]
    ]
}]);