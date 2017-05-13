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
cjsApp.controller('openModal', ['$scope', '$http', 'pageData', 'getItemService',
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
                initPagination($scope, $http);
                // $scope.$apply();
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
        $scope.formData = {};
        var obj = $(event.relatedTarget);
        var editId = obj.data('whatever');
        // 如果不为空则为编辑状态
        if (editId) {
            getItemService.itemInfo(pageData.bigCategory, editId).then(function(result) {
                $scope.formData = result.data;
            })
        }
        $scope.$apply();
    });
}]);
cjsApp.directive('dateFormat', ['$filter',
function($filter) {
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

cjsApp.controller('DatepickerPopupDemoCtrl',
function($scope) {

    $scope.dateOptions = {
        maxDate: new Date(2020, 5, 22),
        startingDay: 1
    };

    $scope.open = function() {
        $scope.popup.opened = true;
    };

    $scope.popup = {
        opened: false
    };
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

cjsApp.controller("adminList", ['$scope', '$http', '$filter', 'pageData', 'getItemService',
function($scope, $http, $filter, pageData, getItemService) {
    //获取管理员列表信息
    initPagination($scope, $http);
    initDelOption($scope, $http, '您确认要删除选中的'+pageData.siteInfo+'吗？');

}]);
cjsApp.directive("initSelects", ['initSelect',
    function(initSelect) {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, element, attrs) {
                initSelect.itemInfo(attrs.initSelects).then(function(result) {
                    if(result.status = 200){
                    scope.selects = result.data;
                    // console.log(result);
                    }else{
                        console.log("获取分页信息失败")
                    }
                })
            }
        }
}]);