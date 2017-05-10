/**
 * Created by cbj on 2016/1/5.
 *根据请求返回不同的对象进行处理
 */
var url = require('url');
var settings = require("../settings");
//数据库操作
var DBOpt = require("../models/DBOpt");
var AdminUser = require("../models/AdminUser");
var AdminGroup = require("../models/AdminGroup");
var Patent = require("../models/Patent");
var Direction = require("../models/Direction");
var Person = require("../models/Person");
var CCFLevel = require("../models/CCFLevel");
var AwardLevel = require("../models/AwardLevel");
var ProjectLevel = require("../models/ProjectLevel");



var adminBean = {
	getTargetObj : function(currentPage){
        var targetObj;
        if(currentPage === 'sysTemManage_user' ){
            targetObj = AdminUser;
        }else if(currentPage === 'sysTemManage_uGroup' ){
            targetObj = AdminGroup;
        }else if(currentPage === 'sysTemManage_patent' ){
            targetObj = Patent;
        }else if(currentPage === 'sysTemManage_direction' ){
            targetObj = Direction;
        }else if(currentPage === 'sysTemManage_person' ){
            targetObj = Person;
        }else if(currentPage === 'sysTemManage_ccf' ){
            targetObj = CCFLevel;
        }else if(currentPage === 'sysTemManage_award_level' ){
            targetObj = AwardLevel;
        }else if(currentPage === 'sysTemManage_project_level' ){
            targetObj = ProjectLevel;
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
    setQueryByArea : function(req,keyPr,targetObj,area){
        var newKeyPr = keyPr;
       
        return newKeyPr;
    },
    getClienIp : function(req){
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    },
}

module.exports = adminBean;