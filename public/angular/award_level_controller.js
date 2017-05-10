/**
 * Created by cbj on 2016/1/5.
 * cjs自定义控制器
 */
 //管理专利列表
 cjsApp.controller("adminAwardLevel",['$scope','$http','pageData','getItemService',
    function($scope,$http,pageData,getItemService){
    // console.log('debug');
        $scope.formData = {};
        //获取管理员列表信息
        initPagination($scope,$http);
        //删除用户
        initDelOption($scope,$http,'您确认要删除选中的奖项级别吗？');
        $('#addNewAwardLevel').modal({dimmer:0,closeViaDimmer: 0, width: 800});
        $('#addNewAwardLevel').modal('toggle');
        $('#addNewAwardLevel').on('open.modal.amui', function (event) {
            console.log("弹出框");
            var obj = $(event.relatedTarget);
            var editId = obj.data('whatever');
            // 如果不为空则为编辑状态
            if(editId){
                getItemService.itemInfo(pageData.bigCategory,editId).success(function(result){
                    $scope.formData = result;
                    $scope.targetID = editId;
                })
            }
            $scope.$apply();
        }).on('close.modal.amui', function (e) {
            console.log("关闭弹出框");
            // 清空数据
            //$(this).removeData('amui.modal');
            clearModalData($scope,$(this));
        });

         //添加新用户或修改用户
        $scope.processForm = function(isValid){
            if(false){
            //if(!$scope.formData.group){
                // $.tipsShow({
                //     message : '请选择用户组',
                //     type : 'warning' ,
                //     callBack : function(){
                //         return;
                //     }
                // });
            }else{
                angularHttpPost($http,isValid,getTargetPostUrl($scope,pageData.bigCategory),$scope.formData,function(data){
                    initPagination($scope,$http);
                });
            }

        };
}]);
  
