/**
 * Created by cbj on 2016/1/5.
 * cjs自定义控制器
 */
var cjsApp = angular.module('adminApp', ['ngSanitize', 'ui.bootstrap', 'ui.select', 'ui.grid']);
cjsApp.factory('pageData',
function() {
    return {
        bigCategory: $("#currentCate").val(),
        siteInfo : $('#siteInfo').val()
    }
});

cjsApp.factory('getItemService', ['$http',
function($http) {
    //获取单个对象信息
    var getItemRequest = function(currentPage, targetId) {
        var requestPath = "/admin/manage/" + currentPage + "/item?uid=" + targetId;
        return $http.get(requestPath)
    };
    return {
        itemInfo: function(currentPage, targetId) {
            return getItemRequest(currentPage, targetId);
        }
    }
}]);
cjsApp.factory('initSelect', ['$http',
function($http) { 
    //获取单个对象信息
    var getListRequest = function(request) {
        var requestPath = "/admin/manage/"+request+"/findAll"
        return $http.get(requestPath)
    };
    return {
        itemInfo: function(request) {
            return getListRequest(request);
        }
    }
}]);
cjsApp.factory('webSocketData',
function() {
    var ws = io.connect('http://127.0.0.1:8888');
    ws.on('connect',
    function(msg) {});
    var logs = [];
    ws.on('logChange',
    function(msg) {
        // logs.push(msg);
        $('#loging').append("<span class=\"am-text-success\" >" + msg.time + "  </span>" + "<span class=\"am-text-secondary\" >" + msg.level + "  </span>" + "<span class=\"am-text-primary\" >" + msg.type + "  </span>" + "<span class=\"am-text-default\" >" + msg.msg + "  </span>");
        $('#scroll').animate({
            scrollTop: $('#loging').height()
        },
        50);
    });
    var methods = {
        logArray: function() {
            return logs;
        }
    };
    return methods;
});
cjsApp.directive('fileModel', ['$parse',
function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change',
            function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                    scope.formData.file_name = element[0].files[0].name;
                });
            });
        }
    };
}]);


cjsApp.directive('datePicker',function() {
    return{
        require: 'ngModel',
        restrict: 'A',
        link: function(scope,element,attr,ctrl) {
            function formatter(value) {
                if(value)
                    return new Date(value);
                else
                    return value;
            }
            ctrl.$formatters.push(formatter);

            scope.dateOptions = {
                maxDate: new Date(2020, 5, 22),
                startingDay: 1,
                initDate : new Date()
            };

            scope[attr.datePicker]={
                open : function() {
                scope[attr.datePicker].popup.opened = true;
                },popup : {
                opened: false
            }
            }
        }
    }
});
cjsApp.filter('propsFilter',
function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
cjsApp.directive("initSelects", ['initSelect',
    function(initSelect) {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, element, attrs) {
                initSelect.itemInfo(attrs.initSelects).then(function(result) {
                    scope.selects = result.data;
                },function(result){
                })
            }
        }
}]);
cjsApp.controller("adminLoging",['$scope','webSocketData',function($scope,webSocketData){
    $scope.logarrays = webSocketData.logArray();
}]);
cjsApp.controller("adminList", ['$scope', '$rootScope','$http', '$filter', 'pageData', 'getItemService',
function($scope, $rootScope,$http, $filter, pageData, getItemService) {
    //获取管理员列表信息
    $rootScope.$on("SomeChangeUp",function(event,msg){
        console.log("parent"+msg);
        $rootScope.$broadcast("SomeChangeDown",msg);
    });
    $scope.$on("SomeChangeDown",function(event,msg){
        initPagination($scope, $http);
    });
    initPagination($scope, $http);
    initDelOption($scope, $http, '您确认要删除选中的'+pageData.siteInfo+'吗？');


}]);
cjsApp.controller('openModal', ['$scope', '$http', 'pageData','getItemService',
function($scope, $http, pageData, getItemService) {
    $scope.processForm = function(isValid) {
        if (false) {
            //if(!$scope.formData.group){
            // $.tipsShow({
            //     message : '请选择用户组',
            //     type : 'warning' ,
            //     callBack : function(){
            //         return;
            //     }
            // });
        } else {
            //用于向Mongo中保存图片的metadata
            $scope.formData['bigCategory']=pageData.bigCategory;
            console.log($scope.formData);
            angularHttpPost($http, isValid, getTargetPostUrl($scope, pageData.bigCategory), $scope.formData,
            function(data) {
                $scope.$emit("SomeChangeUp", data);
            });
        }

    };
    $('#addNew').modal({
        dimmer: 0,
        closeViaDimmer: 0,
        width: 600
    });
    $('#addNew').modal('toggle');
    
    $('#addNew').bind('open.modal.amui',
    function(event) {
        console.log("弹出框");
        var obj = $(event.relatedTarget);
        var editId = obj.data('whatever');
        // 如果不为空则为编辑状态
        if (editId) {
            getItemService.itemInfo(pageData.bigCategory, editId).then(function(result) {
                $scope.formData = result.data;
                console.log($scope.formData);
            })
        }else{
            $scope.formData = {};
        }
        $scope.$apply();
    });
}]);
cjsApp.controller('openTreeModal', ['$scope', '$http', 'pageData','getItemService',
function($scope, $http, pageData, getItemService) {
    initPowerList($scope);
    $scope.processForm = function(isValid) {
        if (false) {
            //if(!$scope.formData.group){
            // $.tipsShow({
            //     message : '请选择用户组',
            //     type : 'warning' ,
            //     callBack : function(){
            //         return;
            //     }
            // });
        } else {
            var groupData = {
            // _id ： $scope.formData._id,
            name : $scope.formData.name,
            power : JSON.stringify($scope.formData.power),
            comments: $scope.formData.comments
            };
            angularHttpPost($http, isValid, getTargetPostUrl($scope, pageData.bigCategory),groupData,
            function(data) {
                $scope.$emit("SomeChangeUp", data);
            });
        }

    };
    $('#addNewAdminGroup').modal({
        dimmer: 0,
        closeViaDimmer: 0,
        width: 600
    });
    $('#addNewAdminGroup').modal('toggle');
    
    $('#addNewAdminGroup').bind('open.modal.amui',
    function(event) {
        console.log("弹出框");
        $scope.formData = {};
        cancelTreeCheckBoxSelect("groupPowerTree");
        var obj = $(event.relatedTarget);
        var editId = obj.data('whatever');
        // 如果不为空则为编辑状态
        if (editId) {
            getItemService.itemInfo(pageData.bigCategory, editId).then(function(result) {
                result = result.data;
                console.log(result);

                $scope.formData = result;
                if(result.power){
                    $scope.formData.power = JSON.parse(result.power);
                    // 回选checkbox
                    var powerTreeObj = eval(result.power);
                    for(var i=0;i<powerTreeObj.length;i++){
                        var checkedId = powerTreeObj[i].split(':')[0];
                        var treeObj = $.fn.zTree.getZTreeObj("groupPowerTree");
                        var node = treeObj.getNodeByParam("id", checkedId, null);
                        if(node){
                            node.checked = true;
                            treeObj.updateNode(node);
                        }
                    }
                }
            })
        }
        $scope.$apply();
    });
}]);
