/**
 * Created by cbj on 2017/1/10.
 * 系统操作日志
 */
 var mongoose = require('mongoose');
 var shortid = require('shortid');
 var url = require('url');
 var Schema = mongoose.Schema;

 var SystemLogSchema = new Schema({
 	_id: {
 		type: String,
 		unique: true,
 		'default': shortid.generate
 	},
 	type: String,
 	date: {type: Date, default: Date.now},
 	logs: String
 });

 SystemLogSchema.statics = {
 	//添加用户登录日志
 	addLoginLogs : function(req, res, tragetIp){
 		var loginLog = new SystemLog();
 		loginLog.type = 'login';
 		loginLog.logs = "{'userName':"+req.session.adminUserInfo.userName+",'ip':"+tragetIp+"}";
 		loginLog.save(function(err){
 			if(err){
 				res.end(err);
 			}
 		});
 	},
        addRemoveLogs : function(req, res, tragetIp,obj,callback){
        var loginLog = new SystemLog();
        loginLog.type = 'remove';
        var currentPage = req.params.defaultUrl;
        var params = url.parse(req.url,true);
        var targetId = params.query.uid;
        obj.findOne({_id : targetId}, function (err,result) {
                if(err){
                    res.next(err);
                }else{
                    loginLog.logs = "{'userName':"+req.session.adminUserInfo.userName+",'ip':"+tragetIp+",'table':"+currentPage+",'name:'"+result.name+"}";
                    loginLog.save(function(err){
                        if(err){
                            res.end(err);
                        }
                    });
                }
                callback();
            });
        
    },
        addAddLogs : function(req, res, tragetIp){
        var loginLog = new SystemLog();
        loginLog.type = 'add';
        var currentPage = req.params.defaultUrl;
        var name = req.body.name;
        loginLog.logs = "{'userName':"+req.session.adminUserInfo.userName+",'ip':"+tragetIp+",'table':"+currentPage+",'name:'"+name+"}";
        loginLog.save(function(err){
            if(err){
                res.end(err);
            }
        });
    },
        addUpdateLogs : function(req, res, tragetIp){
        var loginLog = new SystemLog();
        loginLog.type = 'update';
        var currentPage = req.params.defaultUrl;
        var name = req.body.name;
        loginLog.logs = "{'userName':"+req.session.adminUserInfo.userName+",'ip':"+tragetIp+",'table':"+currentPage+",'name:'"+name+"}";
        loginLog.save(function(err){
            if(err){
                res.end(err);
            }
        });
    }
 }

 var SystemLog = mongoose.model('SystemLog', SystemLogSchema);
 module.exports = SystemLog;