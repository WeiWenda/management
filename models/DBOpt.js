/**
 *Created by cbj on 2017/1/4.
 *mongodb数据库操作
 **/
 var url = require('url');
 var mongoose = require('mongoose');
 var fs = require('fs');
 var Grid = require('gridfs-stream');
 mongoose.Promise = require('bluebird');
 var settings = require('../settings');
//后台管理用户
var AdminUser = require('../models/AdminUser');
var AdminGroup = require('../models/AdminGroup');

var Patent = require('../models/Patent');
var Project = require("../models/Project");
var Paper = require("../models/Paper");
var Award = require("../models/Award");
var SoftwareCopyright = require("../models/SoftwareCopyright");

var Direction = require("../models/Direction");
var Person = require("../models/Person");
var CCFLevel = require("../models/CCFLevel");
var AwardLevel = require("../models/AwardLevel");
var ProjectLevel = require("../models/ProjectLevel");

//短id
var shortid = require('shortid');
//密码加密
var pass = require('../utils/pass');
var path = require('path');
var util = require('util');
var urlencode = require('urlencode');

mongoose.connect(settings.URL);
var db = mongoose.connection;
Grid.mongo = mongoose.mongo;

var mongooseSchema = new mongoose.Schema({
    filename: String,
    metadata: String,
    aliases: String
}, {collection: "fs.files", versionKey: ""});
var getFile = db.model('getFile', mongooseSchema);
var gfs = Grid(db.db);

 //mongoose.connect('mongodb://'+settings.USERNAME+':'+settings.PASSWORD+'@'+settings.HOST+':'+settings.PORT+'/'+settings.DB+'');
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function (callback) {
    var gfs = Grid(db.db);
    console.log("连接mongodb");
  	//初始化管理员用户信息
	//验证用户名密码
    AdminUser.findOne({'userName': 'admin'}).exec(function(err, user){
        if(err){
            console.log("初始化管理员用户信息失败");
        }
        if(user){
            console.log("管理员用户已存在");
        }else{
            var groupID = shortid.generate();
            var adminGroup = new AdminGroup();
            adminGroup.name = '管理员';
            adminGroup._id = groupID;
            adminGroup.power = settings.system_Power;
            adminGroup.save(function(eer){
                if(err){
                    console.log("初始化管理员用户组信息失败");
                }else{
                    console.log("初始化管理员用户组信息成功");
                    console.log("管理员用户不存在");
                    var adminuser = new AdminUser();
                    adminuser.userName = 'admin';
                    adminuser.group = groupID;
                    adminuser.name = '超级管理员'
                    pass.hash('password',function(err, salt, hash){
                        adminuser.password = hash;
                        adminuser.salt = salt;
                        adminuser.save(function(err){
                            if(err){
                                console.log("初始化管理员用户信息失败");
                            }else{
                                console.log("初始化管理员用户信息成功");
                            }
                        });
                    });
                }
            });

        }
    });
});
//数据库操作
var DBOpt = {
	addOne : function(obj,req,res){
        var newObj = new obj(req.body);
        newObj.save(function(err){
            if(err){
                res.end(err);
            }else{
                res.end("success");
            }
        });
    },
    pagination : function(obj,req,res){

        query=obj.find({});

        if(obj === AdminUser){
            query.populate('group').sort({'createtime': -1});
        }
        if(obj === Patent ){
            query.populate('direction').populate('owner').sort({'authorized_time': -1});
        }
        if(obj === SoftwareCopyright){
            query.populate('direction').sort({'authorized_time': -1});
        }
        if(obj === Project){
            query.populate('type').populate('principal').sort({'start_time': -1});
        }
        if(obj === Award){
            query.populate('type').populate('winner').sort({'time': -1});
        }
        if(obj === Paper){
            query.populate('type').populate('direction').populate('author').populate('project').sort({'publish_time': -1});
        }
        query.exec(function(err,docs){
            if(err){
                console.log(err)
            }else {
                return res.json({
                    docs:docs,
                });
            }
        })
    },
    del : function(obj,req,res,logMsg){
        var params = url.parse(req.url,true);
        var targetId = params.query.uid;
        if(shortid.isValid(targetId)){
            if(obj === Direction){
                Patent.count({direction:targetId},function(err,count){
                    if(count > 0 )
                        res.status(400).end(settings.system_foreign_key);
                    else
                        SoftwareCopyright.count({direction:targetId},function(err,count){
                            if(count > 0)
                                res.status(400).end(settings.system_foreign_key);
                            else 
                                Paper.count({direction:targetId},function(err,count){
                                    if(count > 0 )
                                        res.status(400).end(settings.system_foreign_key);
                                    else
                                        obj.remove({_id : params.query.uid},function(err,result){
                                            if(err){
                                                res.end(err);
                                            }else{
                                                console.log(logMsg+" success!");
                                                res.end("success");
                                            }
                                        });
                                })
                        })
                })
            }
            if(obj === Person ) {
                Patent.count({owner:targetId},function(err,count){
                    if(count > 0 )
                        res.status(400).end(settings.system_foreign_key);
                    else
                        Award.count({winner:targetId},function(err,count){
                            if(count > 0)
                                res.status(400).end(settings.system_foreign_key);
                            else 
                                Paper.count({author:targetId},function(err,count){
                                    if(count > 0 )
                                        res.status(400).end(settings.system_foreign_key);
                                    else
                                        Project.count({principal:targetId},function(err,count){
                                            if(count>0)
                                                res.status(400).end(settings.system_foreign_key);
                                            else
                                                obj.remove({_id : params.query.uid},function(err,result){
                                                    if(err){
                                                        res.end(err);
                                                    }else{
                                                        console.log(logMsg+" success!");
                                                        res.end("success");
                                                    }
                                                });
                                        })

                                })
                        })
                })
            }
            if(obj === CCFLevel){
                Paper.count({type:targetId},function(err,count){
                    if(count>0)
                        res.status(400).end(settings.system_foreign_key);
                    else
                     obj.remove({_id : params.query.uid},function(err,result){
                        if(err){
                            res.end(err);
                        }else{
                            console.log(logMsg+" success!");
                            res.end("success");
                        }
                    });

             })
            }
            if(obj === AwardLevel){
                Award.count({type:targetId},function(err,count){
                    if(count>0)
                        res.status(400).end(settings.system_foreign_key);
                    else
                     obj.remove({_id : params.query.uid},function(err,result){
                        if(err){
                            res.end(err);
                        }else{
                            console.log(logMsg+" success!");
                            res.end("success");
                        }
                    });

             })
            }
            if(obj === ProjectLevel){
                Project.count({type:targetId},function(err,count){
                    if(count>0)
                        res.status(400).end(settings.system_foreign_key);
                    else
                     obj.remove({_id : params.query.uid},function(err,result){
                        if(err){
                            res.end(err);
                        }else{
                            console.log(logMsg+" success!");
                            res.end("success");
                        }
                    });

             })
            }
            if(obj === Project){
                Paper.count({project:targetId},function(err,count){
                    if(count>0)
                        res.status(400).end(settings.system_foreign_key);
                    else
                     obj.remove({_id : params.query.uid},function(err,result){
                        if(err){
                            res.end(err);
                        }else{
                            console.log(logMsg+" success!");
                            res.end("success");
                        }
                    });

             })
            }
            if(obj === Paper || obj === Patent  || obj === SoftwareCopyright    || obj === Award ){
                 obj.remove({_id : params.query.uid},function(err,result){
                        if(err){
                            res.end(err);
                        }else{
                            console.log(logMsg+" success!");
                            res.end("success");
                        }
                    });
            }
        }else{
            res.end(settings.system_illegal_param);
        }
    },
    updateOneByID : function(obj,req,res,logMsg){
        var params = url.parse(req.url,true);
        var targetId = params.query.uid;

        if(shortid.isValid(targetId)){
            var conditions = {_id : targetId};
            req.body.updateDate = new Date();
            var update = {$set : req.body};
            obj.update(conditions, update, function (err,result) {
                if(err){
                    res.end(err);
                }else{
                    console.log(logMsg+" success!");
                    res.end("success");
                }
            })
        }else{
            res.end(settings.system_illegal_param);
        }
    },
    findOne : function(obj,req,res,logMsg){ //根据ID查找单条记录
        var params = url.parse(req.url,true);
        var targetId = params.query.uid;
        if(shortid.isValid(targetId)){
            obj.findOne({_id : targetId}, function (err,result) {
                if(err){
                    res.next(err);
                }else{
                    console.log(logMsg+" success!");
                    return res.json(result);
                }
            })
        }else{
            res.end(settings.system_illegal_param);
        }

    },
    findAll : function(obj,req,res,logMsg){//查找指定对象所有记录
        obj.find({}, function (err,result) {
            if(err){
                res.next(err);
            }else{
                console.log(logMsg+" success!");
                return res.json(result);
            }
        })
    },
    loadToMongo : function (name,originalname,httpId,path,callback) {
        var writestream = gfs.createWriteStream({
            filename: name,
            metadata:httpId,
            aliases:originalname
        });
        fs.createReadStream(path).pipe(writestream);
        writestream.on('close', function (file) {
            callback();
        });
    },
    removeFile:function(name){
        if(name != undefined){
            gfs.remove({filename:name}, function (err) {
              if (err) return handleError(err);
          });
        }
    },
    readFile : function (dir, name,res) {
        var fs_write_stream = fs.createWriteStream("tmp/" + dir + "/" + name);
        var readstream = gfs.createReadStream({
            filename: name
        });
        readstream.pipe(fs_write_stream);
        fs_write_stream.on('close', function () {
            res.sendFile(path.resolve("tmp/" + dir + "/" + name));
             //http://localhost:8888/admin/manage/patent/picture?id=79bcce41336c6f2cd4c4f64dd9faa45a.jpg
         });
    }
};

module.exports = DBOpt;