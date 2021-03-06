/**
 * Created by cbj on 2016/1/5.
 * cjs自定义控制器
 */
 var cjsApp = angular.module('adminApp', ['ngSanitize', 'ui.bootstrap', 'ui.select', 'ui.grid', 'ui.grid.exporter', 'ui.grid.selection', 'ui.grid.pagination', 'ui.grid.pinning', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.grouping']);
 cjsApp.factory('pageData',
    function() {
        var bigCategory = $("#currentCate").val();
        return {
            bigCategory: bigCategory,
            siteInfo: $('#siteInfo').val(),
            timeFilterTemplate: "<div class=\"ui-grid-filter-container\" ng-style=\"col.extraStyle\" ng-repeat=\"colFilter in col.filters\" ng-class=\"{'ui-grid-filter-cancel-button-hidden' : colFilter.disableCancelFilterButton === true }\"><input readonly type=\"text\" date-am-picker class=\"ui-grid-filter-input ui-grid-filter-input-{{$index}}\" ng-model=\"colFilter.term\" ng-attr-placeholder=\"{{colFilter.placeholder || ''}}\" aria-label=\"{{colFilter.ariaLabel || aria.defaultFilterLabel}}\"><div role=\"button\" class=\"ui-grid-filter-button\" ng-click=\"removeFilter(colFilter, $index)\" ng-if=\"!colFilter.disableCancelFilterButton\" ng-disabled=\"colFilter.term === undefined || colFilter.term === null || colFilter.term === ''\" ng-show=\"colFilter.term !== undefined && colFilter.term !== null && colFilter.term !== ''\"><i class=\"ui-grid-icon-cancel\" ui-grid-one-bind-aria-label=\"aria.removeFilter\">&nbsp;</i></div></div>",
            opeTemplate: '<div class="tpl-table-black-operation"> <a ng-click="grid.appScope.editOneItem(row.entity._id)"> <i class="am-icon-pencil"></i> 编辑 </a> <a href="javascript:;" class="tpl-table-black-operation-del" ng-click="grid.appScope.delOneItem(row.entity._id)"> <i class="am-icon-trash"></i> 删除 </a> <a ng-show="{{row.entity.file_path != undfined}}" href="/admin/manage/' + bigCategory + '/picture?id={{ row.entity.file_path}}" target="_blank" > <i class="am-icon-paperclip"></i> 查看原件</a> </div>',
            citeTemplate: '<div class="tpl-table-black-operation"> <a href="http://scholar.google.com/scholar?hl=zh-CN&q={{row.entity.name}}" target="_blank"> Google </a> <a href="/admin/sci?q={{row.entity.name}}" target="_blank"> SCI </a><a href="/admin/ei?q={{row.entity.name}}" target="_blank"> EI </a><a href="http://xueshu.baidu.com/s?wd={{row.entity.name}}" target="_blank"> 百度 </a> </div>'
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
    }
    ]);
 cjsApp.factory('initSelect', ['$http',
    function($http) {
        //获取单个对象信息
        var getListRequest = function(request) {
            var requestPath = "/admin/manage/" + request + "/findAll"
            return $http.get(requestPath)
        };
        return {
            itemInfo: function(request) {
                return getListRequest(request);
            }
        }
    }
    ]);
 cjsApp.factory('initList', ['$http',
    function($http) {
        //获取单个对象信息
        var getListRequest = function(request) {
            var requestPath = "/admin/manage/getDocumentList/" + request
            return $http.get(requestPath)
        };
        return {
            itemInfo: function(request) {
                return getListRequest(request);
            }
        }
    }
    ]);

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
    }
    ]);
 cjsApp.directive('dateAmPicker', ['$filter', function($filter) {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            element.datepicker().on('changeDate.datepicker.amui', function(event) {
                scope.$apply(function() {
                    ctrl.$setViewValue(event.date);
                    element.val($filter('date')(event.date, 'yyyy-MM-dd'));
                });
            })
        }
    }
}]);

 cjsApp.directive('datePicker', ['$filter',function($filter) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attr, ctrl) {
            function formatter(value) {
                if (value)
                    return new Date(value);
                else
                    return value;
            }
            function newValidator(modelValue, viewValue){
                var value = modelValue || viewValue;
                if (attr.ngRequired){
                    if(value)
                        return true;
                    else
                        return false;
                }
                return true;
            }
            ctrl.$validators.date = newValidator;
            ctrl.$formatters.push(formatter);


            scope.dateOptions = {
                maxDate: new Date(2030, 12, 31),
                startingDay: 1,
                initDate: new Date()
            };

            scope[attr.datePicker] = {
                open: function() {
                    scope[attr.datePicker].popup.opened = true;
                },
                popup: {
                    opened: false
                }
            }
        }
    }
}]);

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
                        if (item[prop] && item[prop].toString().toLowerCase().indexOf(text) !== -1) {
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
                }, function(result) {})
            }
        }
    }
    ]);
 cjsApp.directive('checkRepeat', function () {
  return {
      require: "ngModel",
      scope:true ,
      link: function (scope, element, attr, ngModel) {
        function checkRepeat(data,search,attrName){
            return data.map(function(obj){return obj[attrName]}).indexOf(search) < 0;
        };
        function formatter(value){
            if(value){
                scope.back = value;
                ngModel.$setValidity("checkRepeat", true);
            }else{
                delete scope.back;
                ngModel.$setValidity("checkRepeat", false);
            }
            return value;
        }
        ngModel.$formatters.push(formatter);
        function parser(value){
            if(value == scope.back){
                ngModel.$setValidity("checkRepeat", true);
            }else{
                var validity = !ngModel.$isEmpty(value) && checkRepeat(scope.$parent.data,value,attr.checkRepeat);
                ngModel.$setValidity("checkRepeat", validity);
            } 
            return value;
        }
        ngModel.$parsers.unshift(parser);
    }
}
}
);
// cjsApp.controller("adminLoging",['$scope','webSocketData',function($scope,webSocketData){
//     $scope.logarrays = webSocketData.logArray();
// }]);
cjsApp.controller('adminShortList', ['$scope', '$rootScope','$http', 'pageData', 'initList','$timeout','uiGridConstants',
    function($scope,$rootScope, $http, pageData, initList,$timeout,uiGridConstants) {
        $rootScope.$on("SomeChangeUp",function(event,msg){
            $rootScope.$broadcast("SomeChangeDown",msg);
        });
        $scope.$on("SomeChangeDown",function(event,msg){
         refreshPage($scope,pageData,initList,function(){},$timeout,$http,uiGridConstants);
     });
        refreshPage($scope,pageData,initList,function(){},$timeout,$http,uiGridConstants);
    }
    ]);
cjsApp.controller('openModal', ['$scope', '$http', 'pageData', 'getItemService','$rootScope',
    function($scope, $http, pageData, getItemService,$rootScope) {
        $rootScope.$on("OpenModalUp",function(event,msg){
            $rootScope.$broadcast("OpenModalDown",msg);
        });
        $scope.$on("OpenModalDown",function(event,msg){
            $('#addNew').modal({
                    dimmer: 0,
                    closeViaDimmer: 0,
                    width: 600
                });
            if (msg) {
                getItemService.itemInfo(pageData.bigCategory, msg).then(function(result) {
                    $scope.formData = result.data;
                    console.log($scope.formData);
                })
            } else {
                $scope.formData = {};
            }
        });
        $scope.processForm = function(isValid) {
            if (false) {
            } else {
                //用于向Mongo中保存图片的metadata
                $scope.formData['bigCategory'] = pageData.bigCategory;
                console.log($scope.formData);
                angularHttpPost($http, isValid, getTargetPostUrl($scope, pageData.bigCategory), $scope.formData,
                    function(data) {
                        $scope.$emit("SomeChangeUp", data);
                    });
            }

        };
    }
    ]);
cjsApp.controller('openTreeModal', ['$scope', '$http', 'pageData', 'getItemService',
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
                    name: $scope.formData.name,
                    power: JSON.stringify($scope.formData.power),
                    comments: $scope.formData.comments
                };
                angularHttpPost($http, isValid, getTargetPostUrl($scope, pageData.bigCategory), groupData,
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
                        if (result.power) {
                            $scope.formData.power = JSON.parse(result.power);
                            // 回选checkbox
                            var powerTreeObj = eval(result.power);
                            for (var i = 0; i < powerTreeObj.length; i++) {
                                var checkedId = powerTreeObj[i].split(':')[0];
                                var treeObj = $.fn.zTree.getZTreeObj("groupPowerTree");
                                var node = treeObj.getNodeByParam("id", checkedId, null);
                                if (node) {
                                    node.checked = true;
                                    treeObj.updateNode(node);
                                }
                            }
                        }
                    })
                }
                $scope.$apply();
            });
    }
    ]);
