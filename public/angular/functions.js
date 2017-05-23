function findZip(term,value,row,column){
    var names = term.split(',');
    var flag = true;
    names.forEach(function(name){
        if(value.indexOf(name) < 0){
           flag=false;
       }     
   });
    return flag;
}

function checkStart(term, value) {
    var now = moment(value);
    if(term) {
        if(moment(term).isAfter(now, 'day')) return false;
    } 
    return true;
}

function checkEnd(term, value) {
    var now = moment(value);
    if(term) {
        if(moment(term).isBefore(now, 'day')) return false;
    } 
    return true;
}
function zipAtribute(data,attr,subattr){
    for (var outi=0;outi<data.length;outi++){
        var items = data[outi][attr];
        
        if(items.length >0){
            var toAdd ='';
            for(var i=0;i<items.length-1;i++){
                toAdd += items[i][subattr]+',';
            }
            toAdd += items[items.length-1][subattr];
            data[outi]['zip'+attr]= toAdd;
        }else{
            data[outi]['zip'+attr]= '';
        }
        
    }
}

function refreshPage($scope,pageData,initList,callback,$timeout){
    $("#dataloading").modal('open');
    initList.itemInfo(pageData.bigCategory).then(function(result){
        $timeout(function(){
            result=result.data;
            $scope.$parent.data = result.docs;
            if($scope.gridOptions)
                $scope.gridOptions.data = result.docs;
            $("#dataloading").modal('close');
            callback();
        },500);
    },function(result){
        $("#my-alert").modal();
        $("#alert-modal-msg").text(result.data);
    });
}
function initSelectOptions($scope,initSelect,colNum,collect,col){
    initSelect.itemInfo(collect).then(function(result){
        result = result.data;
        var selectOptions = [];
        for(var i=0;i<result.length;i++){
            var item = result[i];
            item['value']= item[col];
            item['label']= item[col];
        }
        // console.log(result);
        $scope.gridOptions.columnDefs[colNum].filter['selectOptions']=result;
    });
}
function initGridOptions($scope,uiGridConstants,pageData,$interval,$q){
    $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
        var toReturn ='';
        col.filters.forEach(function(filter){
            if(filter.term){
                toReturn = 'header-filtered';
            }
        })
        return toReturn;
  };
  var fakeI18n = function( title ){
    var deferred = $q.defer();
    $interval( function() {
      deferred.resolve( 'col: ' + title );
  }, 100, 1); 
    return deferred.promise;
};

$scope.gridOptions = {
    rowHeight:40,
    exporterMenuCsv:true,
    enableGridMenu:true,
    gridMenuTitleFilter:fakeI18n,
    showGridFooter: true,
    enableFiltering :true,
    enableSorting: true,
    onRegisterApi: function( gridApi ) {
        $scope.gridApi = gridApi;
        $scope.gridApi.core.on.sortChanged( $scope, function( grid, sort ) {
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
        });
    },
    paginationPageSizes: [10, 25, 50, 75],
    paginationPageSize: 10,
    exporterPdfDefaultStyle : {font:'微软雅黑',fontSize: 9}
};
}

//angularJs https Post方法封装
function angularHttpPost($http,isValid,url,formData,callBack){
    //if(isValid){
        if(true){
          var fd = new FormData(); //初始化一个FormData实例
          if('file' in formData){
            console.log('表单中有文件');
            fd.append('file', formData.file);
            delete formData["file"];  
        }
        $http({
            method  : 'POST',
            url     : url,
            headers: {
                    'Content-Type': undefined
                },
            //服务器端用query接收params,用body接收data，用params接收url中的参数
            params:formData,
            transformRequest: angular.identity,
            data: fd
        })
        .then(function(data) {
            //  关闭所有模态窗口
            $('.am-modal').each(function(i){
                $(this).modal("close");
            });
            callBack(data.data);
        },function(result){
             // console.log(result);
             $("#my-alert").modal();
             $("#alert-modal-msg").text(result.data);
         });
    }
    else{
        //$.tipsShow({ message : "参数校验不通过", type : 'warning' });
    }
}
//主要针对删除操作
function angularHttpGet($http,url,callBack){
    $http.get(url).then(function(result){
        $('.modal').each(function(i){
            $(this).modal("hide");
        });
        callBack(result.data);
    },function(result){
        $("#my-alert").modal();
        $("#alert-modal-msg").text(result.data);
    })
}


//获取添加或修改链接
function getTargetPostUrl($scope,bigCategory){
    var url = "/admin/manage/"+bigCategory+"/addOne";
    if($scope.formData._id){
        url = "/admin/manage/"+bigCategory+"/modify?uid="+$scope.formData._id;
    }
    return url;
}

//初始化删除操作
function initDelOption($scope,$http,pageData,initList){
    var info ='您确认要删除选中的'+pageData.siteInfo+'吗？';
    // 单条记录删除
    $scope.delOneItem = function(id){
        initCheckIfDo($scope,id,info,function(currentID){
            angularHttpGet($http,"/admin/manage/"+pageData.bigCategory+"/del?uid="+currentID,function(){
                refreshPage($scope,pageData,initList,function(){});
            });
        });
    };
}

//提示用户操作窗口
function initCheckIfDo($scope,targetId,msg,callBack){
    $('#checkIfDo').on('open.modal.amui', function (event) {
        if(targetId){
            $scope.targetID = targetId;
        }
        $(this).find('.modal-msg').text(msg);
    }).on('close.modal.amui', function (event) {
        $scope.targetID ="";
    });
    $('#checkIfDo').modal({dimmer:true,
        relatedTarget: this,
        onConfirm: function(e) {
            callBack($scope.targetID);
        },
        onCancel: function(e) {
        }
    });
}

//初始化管理员权限列表
function initPowerList($scope){
    var setting = {
        view: {
            selectedMulti: false
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeCheck: beforeCheck,
            onCheck: onCheck
        }
    };
    var zNodes = setAdminPowerTreeData();
    
    var code, log, className = "dark";
    function beforeCheck(treeId, treeNode) {
        className = (className === "dark" ? "":"dark");
        return (treeNode.doCheck !== false);
    }
    function onCheck(e, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("groupPowerTree"),
        checkedNodes = zTree.getCheckedNodes(true);
        var nodesArr = [];
        for(var i=0;i<checkedNodes.length;i++){
            var currentNode = checkedNodes[i];
            nodesArr.push(currentNode.id + ':' + true);
        }
        $scope.formData.power = nodesArr;
    }
    $.fn.zTree.init($("#groupPowerTree"), setting, zNodes);
}
function openLoading(){
    console.log('stat');
    $('#dataloading').modal('open');
}

//ztree 节点取消选中
function cancelTreeCheckBoxSelect(id){
    var treeObj = $.fn.zTree.getZTreeObj(id),
    checkedNodes = treeObj.getCheckedNodes(true);
    for (var i=0, l=checkedNodes.length; i < l; i++) {
        treeObj.checkNode(checkedNodes[i], false, true);
    }
}

//权限管理数据初始化
function setAdminPowerTreeData(){
    return [
    { id:'sysTemManage', pId:0, name:"系统管理", open:false},


    { id:'sysTemManage_user', pId:'sysTemManage', name:"系统用户管理", open:false},
    { id:'sysTemManage_user_add', pId:'sysTemManage_user', name:"新增"},
    { id:'sysTemManage_user_view', pId:'sysTemManage_user', name:"查看"},
    { id:'sysTemManage_user_modify', pId:'sysTemManage_user', name:"修改"},
    { id:'sysTemManage_user_del', pId:'sysTemManage_user', name:"删除"},


    { id:'sysTemManage_uGroup', pId:'sysTemManage', name:"系统用户组管理", open:false},
    { id:'sysTemManage_uGroup_add', pId:'sysTemManage_uGroup', name:"新增"},
    { id:'sysTemManage_uGroup_view', pId:'sysTemManage_uGroup', name:"查看"},
    { id:'sysTemManage_uGroup_modify', pId:'sysTemManage_uGroup', name:"修改"},
    { id:'sysTemManage_uGroup_del', pId:'sysTemManage_uGroup', name:"删除"},
    


    { id:'outcomeManage', pId:1, name:"成果管理", open:false},

    { id:'patent', pId:'outcomeManage', name:"专利管理", open:false},
    { id:'patent_add', pId:'patent', name:"新增"},
    { id:'patent_view', pId:'patent', name:"查看"},
    { id:'patent_modify', pId:'patent', name:"修改"},
    { id:'patent_del', pId:'patent', name:"删除"},

    { id:'software', pId:'outcomeManage', name:"软件著作权管理", open:false},
    { id:'software_add', pId:'software', name:"新增"},
    { id:'software_view', pId:'software', name:"查看"},
    { id:'software_modify', pId:'software', name:"修改"},
    { id:'software_del', pId:'software', name:"删除"},

    { id:'project', pId:'outcomeManage', name:"科研项目管理", open:false},
    { id:'project_add', pId:'project', name:"新增"},
    { id:'project_view', pId:'project', name:"查看"},
    { id:'project_modify', pId:'project', name:"修改"},
    { id:'project_del', pId:'project', name:"删除"},

    { id:'award', pId:'outcomeManage', name:"科研获奖管理", open:false},
    { id:'award_add', pId:'award', name:"新增"},
    { id:'award_view', pId:'award', name:"查看"},
    { id:'award_modify', pId:'award', name:"修改"},
    { id:'award_del', pId:'award', name:"删除"},

    { id:'paper', pId:'outcomeManage', name:"学术论文管理", open:false},
    { id:'paper_add', pId:'paper', name:"新增"},
    { id:'paper_view', pId:'paper', name:"查看"},
    { id:'paper_modify', pId:'paper', name:"修改"},
    { id:'paper_del', pId:'paper', name:"删除"},

    { id:'dimensionManage', pId:2, name:"维度管理", open:false},

    { id:'direction', pId:'dimensionManage', name:"研究方向管理", open:false},
    { id:'direction_add', pId:'direction', name:"新增"},
    { id:'direction_view', pId:'direction', name:"查看"},
    { id:'direction_modify', pId:'direction', name:"修改"},
    { id:'direction_del', pId:'direction', name:"删除"},

    { id:'person', pId:'dimensionManage', name:"研究人员管理", open:false},
    { id:'person_add', pId:'person', name:"新增"},
    { id:'person_view', pId:'person', name:"查看"},
    { id:'person_modify', pId:'person', name:"修改"},
    { id:'person_del', pId:'person', name:"删除"},

    { id:'ccf', pId:'dimensionManage', name:"会议级别管理", open:false},
    { id:'ccf_add', pId:'ccf', name:"新增"},
    { id:'ccf_view', pId:'ccf', name:"查看"},
    { id:'ccf_modify', pId:'ccf', name:"修改"},
    { id:'ccf_del', pId:'ccf', name:"删除"},

    { id:'award_level', pId:'dimensionManage', name:"奖项级别管理", open:false},
    { id:'award_level_add', pId:'award_level', name:"新增"},
    { id:'award_level_view', pId:'award_level', name:"查看"},
    { id:'award_level_modify', pId:'award_level', name:"修改"},
    { id:'award_level_del', pId:'award_level', name:"删除"},

    { id:'project_level', pId:'dimensionManage', name:"项目级别管理", open:false},
    { id:'project_level_add', pId:'project_level', name:"新增"},
    { id:'project_level_view', pId:'project_level', name:"查看"},
    { id:'project_level_modify', pId:'project_level', name:"修改"},
    { id:'project_level_del', pId:'project_level', name:"删除"}

    ]
}


