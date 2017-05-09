/**
 * Created by cbj on 2016/1/5.
 * cjs自定义控制器
 */
//实时日志contruller
cjsApp.controller("adminLoging",['$scope','webSocketData',function($scope,webSocketData){
    $scope.logarrays = webSocketData.logArray();
}]);

  
