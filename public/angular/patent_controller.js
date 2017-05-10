/**
 * Created by cbj on 2016/1/5.
 * cjs自定义控制器
 */
 //管理专利列表
 cjsApp.controller("adminPatent",['$scope','$http','$filter','pageData','getItemService',
    function($scope,$http,$filter,pageData,getItemService){
        $scope.formData = {};
        //获取管理员列表信息
        initPagination($scope,$http);
        //删除用户
        initDelOption($scope,$http,'您确认要删除选中的专利吗？');
        // 修改用户
        initDirections($scope,$http);
        initPersons($scope,$http);
        $('#addNewPatent').modal({dimmer:0,closeViaDimmer: 0, width: 800});
        $('#addNewPatent').modal('toggle');
        $('#apply_time').datepicker().
            on('changeDate.datepicker.amui', function(event) {
              $scope.formData.apply_time = event.date;
            $scope.$apply();
            });
        $('#authorized_time').datepicker().
            on('changeDate.datepicker.amui', function(event) {
              $scope.formData.authorized_time =event.date;
               $scope.$apply();
            });

        $('#doc-form-file').on('change', function() {
          var fileNames = this.files[0].name;
          // $scope.formData.file_path = this.files[0];
          $('#file-list').val(fileNames);
      });

        $('#addNewPatent').on('open.modal.amui', function (event) {
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
                console.log($scope.formData);
                angularHttpPost($http,isValid,getTargetPostUrl($scope,pageData.bigCategory),$scope.formData,function(data){
                    initPagination($scope,$http);
                    });      
            }

        };
}]);
  
