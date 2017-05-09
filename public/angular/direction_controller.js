/**
 * Created by cbj on 2016/1/5.
 * cjs自定义控制器
 */
//管理研究方向列表

cjsApp.controller("adminDirection",['$scope','$http','pageData','getItemService',function($scope,$http,pageData,getItemService){
    $scope.formData = {};
    $scope.formData.power = {};
    $scope.checkInfo = {};
    //获取管理员用户组列表
    initPagination($scope,$http);
    //删除用户
    initDelOption($scope,$http,'您确认要删除选中的研究方向吗？');
    $('#addNewDirection').modal({dimmer:0,closeViaDimmer: 0, width: 800});
    $('#addNewDirection').modal('toggle');
    // 修改用户
    $('#addNewDirection').on('open.modal.amui', function (event) {
        var obj = $(event.relatedTarget);
        var editId = obj.data('whatever');
        // 如果不为空则为编辑状态
        if(editId){
            getItemService.itemInfo(pageData.bigCategory,editId).success(function(result){
                $scope.formData = result;
                $scope.targetID = editId;
            })
        }else{
            $scope.formData = {};
        }
    }).on('close.modal.amui', function (e) {
        clearModalData($scope,$(this));
    });

    // 添加新用户组
    $scope.processForm = function(isValid){
        console.log("add new direction");
        var directionData = {
            name : $scope.formData.name,
            comments: $scope.formData.comments
        };
        angularHttpPost($http,isValid,getTargetPostUrl($scope,pageData.bigCategory),directionData,function(data){
            initPagination($scope,$http);
        });
    }
}]);
  
