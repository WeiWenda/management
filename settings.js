/**
 *Created by cbj on 2017/1/4.
 *系统配置项
 **/

 module.exports = {
 	//mongodb数据库配置
 	URL: 'mongodb://127.0.0.1:27017/cjs',
 	DB: 'cjs',
 	HOST: '',
 	PORT: 27017,
 	USERNAME: '',
 	PASSWOED: '',


 	SYSTEMMANAGE : ['index','后台管理'],  // 后台模块(系统管理)
    adminUsersList : ['sysTemManage_user','用户'],
    adminGroupList : ['sysTemManage_uGroup','用户组'],
    adminLoging : ['sysTemManage_loging','实时日志'],

    patentList : [ 'patent','专利'], 
    softwareList : [ 'software','软件著作权'], 
    projectList : [ 'project','科研项目'], 
    awardList : [ 'award','科研获奖'], 
    paperList : [ 'paper','学术论文'], 


    directionList : [ 'direction','研究方向'], 
    personList : [ 'person','研究人员'], 
    ccfList : [ 'ccf','会议级别'], 
    awardLevelList : [ 'award_level','奖项级别'], 
    projectLevelList : [ 'project_level','项目级别'], 


    system_foreign_key:'外键约束，不能删除！',
    system_illegal_param:'传入参数不合法',
    system_noPower : '用户没有权限',
    system_Power : "[\"sysTemManage:true\",\"outcomeManage:true\",\"dimensionManage:true\","+

    "\"sysTemManage_index:true\",\"sysTemManage_index_view:true\","+

    "\"sysTemManage_user:true\", \"sysTemManage_user_add:true\", "+
    "\"sysTemManage_user_view:true\", \"sysTemManage_user_modify:true\", \"sysTemManage_user_del:true\", "+

    "\"sysTemManage_uGroup:true\", \"sysTemManage_uGroup_add:true\",\"sysTemManage_uGroup_view:true\", "+
    "\"sysTemManage_uGroup_modify:true\", \"sysTemManage_uGroup_del:true\","+

    "\"patent:true\", \"patent_add:true\", \"patent_view:true\", "+
    "\"patent_modify:true\", \"patent_del:true\","+

     "\"software:true\", \"software_add:true\", \"software_view:true\", "+
    "\"software_modify:true\", \"software_del:true\","+

     "\"project:true\", \"project_add:true\", \"project_view:true\", "+
    "\"project_modify:true\", \"project_del:true\","+

         "\"award:true\", \"award_add:true\", \"award_view:true\", "+
    "\"award_modify:true\", \"award_del:true\","+

       "\"paper:true\", \"paper_add:true\", \"paper_view:true\", "+
    "\"paper_modify:true\", \"paper_del:true\","+


    "\"direction:true\", \"direction_add:true\", \"direction_view:true\", "+
    "\"direction_modify:true\", \"direction_del:true\","+

        "\"ccf:true\", \"ccf_add:true\", \"ccf_view:true\", "+
    "\"ccf_modify:true\", \"ccf_del:true\","+

          "\"project_level:true\", \"project_level_add:true\", \"project_level_view:true\", "+
    "\"project_level_modify:true\", \"project_level_del:true\","+

        "\"award_level:true\", \"award_level_add:true\", \"award_level_view:true\", "+
    "\"award_level_modify:true\", \"award_level_del:true\","+

    "\"person:true\", \"person_add:true\", \"person_view:true\", "+
    "\"person_modify:true\", \"person_del:true\"]"
 };