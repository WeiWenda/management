/**
 * Created by cbj on 2016/1/5.
 * cjs自定义控制器
 */
 var cjsApp = angular.module('adminApp',[]);
 cjsApp.factory('pageData',function(){
    return {
        bigCategory : $("#currentCate").val()
    }
});

cjsApp.factory('getItemService',['$http',function($http){
    //获取单个对象信息
    var getItemRequest = function(currentPage,targetId){
        var requestPath = "/admin/manage/"+currentPage+"/item?uid="+targetId;
        return $http.get(requestPath)
    };
    return {
        itemInfo : function(currentPage,targetId){
            return getItemRequest(currentPage,targetId);
        }
    }
}]);
cjsApp.factory('webSocketData', function () {
    var ws = io.connect('http://127.0.0.1:8888');
    ws.on('connect', function(msg){
    });
    var logs = [];
    ws.on('logChange', function(msg){
        // logs.push(msg);
        $('#loging').append("<span class=\"am-text-success\" >"+msg.time+"  </span>"
            +"<span class=\"am-text-secondary\" >"+msg.level+"  </span>"
            +"<span class=\"am-text-primary\" >"+msg.type+"  </span>"
            +"<span class=\"am-text-default\" >"+msg.msg+"  </span>");
        $('#scroll').animate({scrollTop: $('#loging').height()}, 50);
    });
    var methods = {
        logArray: function(){
            return logs;
        }
    };
    return methods;
});  
cjsApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
cjsApp.directive('dateFormat', ['$filter',function($filter) {  
    var dateFilter = $filter('date');  
    return {  
        require: 'ngModel',  
        link: function(scope, elm, attrs, ctrl) {  
  
            function formatter(value) {  
                return dateFilter(value, 'yyyy-MM-dd'); //format  
            }  
  
            function parser() {  
                return ctrl.$modelValue;  
            }  
  
            ctrl.$formatters.push(formatter);  
            ctrl.$parsers.unshift(parser);  
  
        }  
    };  
}]);  