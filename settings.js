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


 	SYSTEMMANAGE : ['sysTemManage','cjs后台管理'],  // 后台模块(系统管理)
    adminUsersList : ['sysTemManage_user','系统用户管理'],
    adminGroupList : ['sysTemManage_uGroup','系统用户组管理'],
    adminLoging : ['sysTemManage_loging','实时日志'],
    patentList : [ 'sysTemManage_patent','管理专利'], 
    directionList : [ 'sysTemManage_direction','管理研究方向'], 
    personList : [ 'sysTemManage_person','管理研究人员'], 
    ccfList : [ 'sysTemManage_ccf','管理会议级别'], 
    awardLevelList : [ 'sysTemManage_award_level','管理奖项级别'], 
    projectLevelList : [ 'sysTemManage_project_level','管理项目级别'], 



    
    system_noPower : '用户没有权限',
    system_Power : "[\"sysTemManage:true\", \"sysTemManage_user:true\", \"sysTemManage_user_add:true\", "+
    "\"sysTemManage_user_view:true\", \"sysTemManage_user_modify:true\", \"sysTemManage_user_del:true\", "+
    "\"sysTemManage_uGroup:true\", \"sysTemManage_uGroup_add:true\",\"sysTemManage_uGroup_view:true\", "+
    "\"sysTemManage_uGroup_modify:true\", \"sysTemManage_uGroup_del:true\","+
    "\"sysTemManage_patent:true\", \"sysTemManage_patent_add:true\", \"sysTemManage_patent_view:true\", "+
    "\"sysTemManage_patent_modify:true\", \"sysTemManage_patent_del:true\","+
    "\"sysTemManage_direction:true\", \"sysTemManage_direction_add:true\", \"sysTemManage_direction_view:true\", "+
    "\"sysTemManage_direction_modify:true\", \"sysTemManage_direction_del:true\","+
        "\"sysTemManage_ccf:true\", \"sysTemManage_ccf_add:true\", \"sysTemManage_ccf_view:true\", "+
    "\"sysTemManage_ccf_modify:true\", \"sysTemManage_ccf_del:true\","+
        "\"sysTemManage_award_level:true\", \"sysTemManage_award_level_add:true\", \"sysTemManage_award_level_view:true\", "+
          "\"sysTemManage_project_level:true\", \"sysTemManage_project_level_add:true\", \"sysTemManage_project_level_view:true\", "+
    "\"sysTemManage_project_level_modify:true\", \"sysTemManage_project_level_del:true\","+
        "\"sysTemManage_award_level:true\", \"sysTemManage_award_level_add:true\", \"sysTemManage_award_level_view:true\", "+
    "\"sysTemManage_award_level_modify:true\", \"sysTemManage_award_level_del:true\","+
    "\"sysTemManage_person:true\", \"sysTemManage_person_add:true\", \"sysTemManage_person_view:true\", "+
    "\"sysTemManage_person_modify:true\", \"sysTemManage_person_del:true\"]"
 };