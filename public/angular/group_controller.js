/**
 * Created by cbj on 2016/1/5.
 * cjs自定义控制器
 */
//管理用户组列表
cjsApp.controller("adminGroup",['$scope','$http','pageData','getItemService',function($scope,$http,pageData,getItemService){
    $scope.formData = {};
    $scope.formData.power = {};
    $scope.checkInfo = {};
    //获取管理员用户组列表
    initPagination($scope,$http);
    //初始化管理栏目列表
    initPowerList($scope);
    //删除用户
    initDelOption($scope,$http,'您确认要删除选中的用户组吗？');
         $('#addNewAdminGroup').modal({dimmer:0,closeViaDimmer: 0, width: 800});
        $('#addNewAdminGroup').modal('toggle');
    // 修改用户
    $('#addNewAdminGroup').on('open.modal.amui', function (event) {
        var obj = $(event.relatedTarget);
        var editId = obj.data('whatever');
        // 如果不为空则为编辑状态
        if(editId){
            getItemService.itemInfo(pageData.bigCategory,editId).success(function(result){
                $scope.formData.name = result.name;
                if(result.power){
                    $scope.formData.power = JSON.parse(result.power);
                    $scope.formData.comments = result.comments;
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
                $scope.targetID = editId;
            })
        }else{
           cancelTreeCheckBoxSelect("groupPowerTree");
            $scope.formData = {};
        }
    }).on('close.modal.amui', function (e) {
        // 清空数据
        cancelTreeCheckBoxSelect("groupPowerTree");
        clearModalData($scope,$(this));
    });

    // 添加新用户组
    $scope.processForm = function(isValid){
        console.log("add user group");
        var groupData = {
            name : $scope.formData.name,
            power : JSON.stringify($scope.formData.power),
            comments: $scope.formData.comments
        };
        angularHttpPost($http,isValid,getTargetPostUrl($scope,pageData.bigCategory),groupData,function(data){
            initPagination($scope,$http);
        });
    }
}]);
  
