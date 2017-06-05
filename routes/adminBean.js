/**
 * Created by cbj on 2016/1/5.
 *根据请求返回不同的对象进行处理
 */
var url = require('url');
var settings = require("../settings");
//数据库操作
var DBOpt = require("../models/DBOpt");
var SystemLogs = require("../models/SystemLog");
var AdminUser = require("../models/AdminUser");
var AdminGroup = require("../models/AdminGroup");

var Patent = require("../models/Patent");
var SoftwareCopyright = require("../models/SoftwareCopyright");
var Project = require("../models/Project");
var Award = require("../models/Award");
var Paper = require("../models/Paper");


var Direction = require("../models/Direction");
var Person = require("../models/Person");
var CCFLevel = require("../models/CCFLevel");
var AwardLevel = require("../models/AwardLevel");
var ProjectLevel = require("../models/ProjectLevel");




var adminBean = {
	getTargetObj : function(currentPage){
        var targetObj;
        if(currentPage === 'index' ){
            targetObj = SystemLogs;
        }else if(currentPage === 'sysTemManage_user' ){
            targetObj = AdminUser;
        }else if(currentPage === 'sysTemManage_uGroup' ){
            targetObj = AdminGroup;
        }else if(currentPage === 'patent' ){
            targetObj = Patent;
        }else if(currentPage === 'direction' ){
            targetObj = Direction;
        }else if(currentPage === 'person' ){
            targetObj = Person;
        }else if(currentPage === 'ccf' ){
            targetObj = CCFLevel;
        }else if(currentPage === 'award_level' ){
            targetObj = AwardLevel;
        }else if(currentPage === 'project_level' ){
            targetObj = ProjectLevel;
        }else if(currentPage === 'software' ){
            targetObj = SoftwareCopyright;
        }else if(currentPage === 'project' ){
            targetObj = Project;
        }else if(currentPage === 'award' ){
            targetObj = Award;
        }else if(currentPage === 'paper' ){
            targetObj = Paper;
        }
        return targetObj
    },
    //权限校验
    checkAdminPower : function(req,key){
        var power = false;
        var uPower = req.session.adminPower;
        if(uPower){
            var newPowers = eval(uPower);
            for(var i=0;i<newPowers.length;i++) {
                var checkedId = newPowers[i].split(':')[0];
                if(checkedId == key && newPowers[i].split(':')[1]){
                    power = true;
                    break;
                }
            }
        }
        return power;
    },
    getClienIp : function(req){
        // console.log(req.ip);
        // console.log(req.headers['x-forwarded-for']);
        // console.log(req.connection.remoteAddress);
        // console.log(req.socket.remoteAddress);

        return req.connection.remoteAddress ;    
    },
}

module.exports = adminBean;