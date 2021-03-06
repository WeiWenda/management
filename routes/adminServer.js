var express = require('express');
var router = express.Router();
router.caseSensitive = true;
var url = require('url');

var pass = require('../utils/pass');
var log = require('log4js').getLogger("adminServer");
//站点配置
var settings = require("../settings");
//数据校验
var validator = require('validator');
//对象管理
var adminBean = require('./adminBean');
//数据操作
var DBOpt = require('../models/DBOpt');
//后台管理用户
var AdminUser = require('../models/AdminUser');
//后台管理用户组
var AdminGroup = require("../models/AdminGroup");
var Patent  = require("../models/Patent");
var SoftwareCopyright  = require("../models/SoftwareCopyright");
var Paper = require("../models/Paper");
var Award  = require("../models/Award");


//后台日志管理
var SystemLog = require("../models/SystemLog");
//密码加密
var pass = require('../utils/pass');
/*跳转到到登录页面*/
router.get("/login", function(req, res, net){
	res.render('admin/login');
});
//管理主界面
router.get('/manage', function(req, res) {
    res.render('admin/homePage', setPageInfo(req,res,settings.SYSTEMMANAGE));
});
//人员管理界面
router.get('/manage/userMge', function(req, res) {
    res.render('admin/userMge', setPageInfo(req,res,settings.adminUsersList));
});
router.get('/manage/patentMge',function(req,res){
    res.render('admin/patentMge',setPageInfo(req,res,settings.patentList));
});
router.get('/manage/softwareMge',function(req,res){
    res.render('admin/softwareMge',setPageInfo(req,res,settings.softwareList));
});
router.get('/manage/projectMge',function(req,res){
    res.render('admin/projectMge',setPageInfo(req,res,settings.projectList));
});
router.get('/manage/awardMge',function(req,res){
    res.render('admin/awardMge',setPageInfo(req,res,settings.awardList));
});
router.get('/manage/paperMge',function(req,res){
    res.render('admin/paperMge',setPageInfo(req,res,settings.paperList));
});
router.get('/manage/directionMge',function(req,res){
    res.render('admin/directionMge',setPageInfo(req,res,settings.directionList));
});
router.get('/manage/ccfMge',function(req,res){
    res.render('admin/ccfMge',setPageInfo(req,res,settings.ccfList));
});
router.get('/manage/awardLevelMge',function(req,res){
    res.render('admin/awardLevelMge',setPageInfo(req,res,settings.awardLevelList));
});
router.get('/manage/projectLevelMge',function(req,res){
    res.render('admin/projectLevelMge',setPageInfo(req,res,settings.projectLevelList));
});
//用户组管理界面
router.get('/manage/groupMge', function(req, res) {
    res.render('admin/groupMge', setPageInfo(req,res,settings.adminGroupList));
});
//研究人员管理界面
router.get('/manage/personMge', function(req, res) {
    res.render('admin/personMge', setPageInfo(req,res,settings.personList));
});
//实时日志界面
router.get('/manage/loging', function(req, res) {
    res.render('admin/loging', setPageInfo(req,res,settings.adminLoging));
});
router.get('/visit',function(req,res){
    AdminUser.findOne({'userName': 'visitor'}).populate('group').exec(function(err, user){
        if(err){
            res.end(err);
        }
        if(user){
            req.session.adminlogined = true;
            req.session.adminUserInfo = user;
            req.session.adminPower = user.group.power;
            // 存入操作日志
            SystemLog.addLoginLogs(req,res,adminBean.getClienIp(req));
            console.log("登录成功");
            res.redirect('/admin/manage/paperMge');
        };
    });
}); 
var request=require('superagent');
router.get('/sci',function(req,res){
    var params = url.parse(req.url,true);
    var querykey = params.query.q;
    const base_headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding':'gzip, deflate',
    'Accept-Language':'zh-CN,zh;q=0.8',
    'Cache-Control':'max-age=0',
    'Connection':'keep-alive',
    'Host':'apps.webofknowledge.com',
    'Origin': 'http://apps.webofknowledge.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36'
    };
    request.get('http://apps.webofknowledge.com')
    .end((err,response)=>{
        var cookie = response.redirects[response.redirects.length-1];
        var params = url.parse(cookie,true);
        var sid = params.query.SID;
        // var jsessionid = params.pathname.match(/jsessionid=(.+)/)[1];
        request.post('http://apps.webofknowledge.com/UA_GeneralSearch.do')
        .set(base_headers)
        // .set('Cookie',JSON.stringify({'SID':sid,'JSESSIONID':jsessionid,'CUSTOMER':'Xian Jiaotong University','E_GROUP_NAME':'Xian Jiaotong University'}))
        .type('form')
        .send({
            'fieldCount':1,
            'action':'search',
            'product':'UA',
            'search_mode':'GeneralSearch',
            'SID':sid,
            'value(input1)':querykey,
            'value(select1)':'TS'
        })
        .end((err,response1)=>{
            res.redirect(response1.redirects[0]);
        });
    }) 
});
router.get('/ei',function(req,res){
    var params = url.parse(req.url,true);
    var querykey = params.query.q.replace('\\s+','+');
    const base_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding':'gzip, deflate, br',
    'Accept-Language':'zh-CN,zh;q=0.8',
    'Connection':'keep-alive',
    'Host':'www.engineeringvillage.com',
    'Origin': 'https://www.engineeringvillage.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36'
    };
    request.post('https://www.engineeringvillage.com/search/submit.url'+'?CID=searchSubmit&searchtype=Quick&usageOrigin=searchform&editSearch=&usageZone=quicksearch&category=quicksearch&resetDataBase=1&database=1&searchWord1='+querykey+'&section1=NO-LIMIT&boolean1=AND&searchWord2=&section2=NO-LIMIT&boolean2=AND&searchWord3=&section3=NO-LIMIT&resetvar=1&doctype=NO-LIMIT&treatmentType=NO-LIMIT&language=NO-LIMIT&yearselect=yearrange&startYear=1969&endYear=2017&stringYear=CSY1884CST1969&updatesNo=1&sort=relevance&angularReq=true')
    .set(base_headers)
    .end((err,response1)=>{
        // console.log(response1);
        res.redirect(response1.redirects[0]);
    });
}); 
/*处理登录请求*/
router.post('/doLogin', function(req, res){
	var userName = req.body.userName;
	var password = req.body.password;
	if(validator.isUserName(userName) && validator.isPsd(password)){
        //验证用户名密码
        AdminUser.findOne({'userName': userName}).populate('group').exec(function(err, user){
            if(err){
                res.end(err);
            }
            if(user){
                pass.hash(password, user.salt, function(err, hash){
                        // console.log(user);
                        if(user.password == hash){
                            req.session.adminlogined = true;
                            req.session.adminUserInfo = user;
                            req.session.adminPower = user.group.power;
                            // 存入操作日志
                            SystemLog.addLoginLogs(req,res,adminBean.getClienIp(req));
                            console.log("登录成功");
                            res.end("success");
                        }
                    });
            }
        });     
    } 
		// console.log("登录失败");
		// res.end("用户名或密码错误");
	});

// 管理员退出
router.get('/logout', function(req, res) {
    req.session.adminlogined = false;
    req.session.adminPower = '';
    req.session.adminUserInfo = '';
    res.redirect("/admin");
});
//-------------------------获取图片-------------------------
//前端会根据是否上传过附件决定是否显示链接
router.get('/manage/:defaultUrl/picture',function(req,res){
    var dir = req.params.defaultUrl;
    var params = url.parse(req.url,true);
    var name = params.query.id;
    if(name){
        DBOpt.readFile(dir,name,res);
    }else{
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
        res.end('<p>找不到文件！</p>');
    }
});
//-------------------------获取单个对象数据开始-------------------------
router.get('/manage/:defaultUrl/item',function(req,res){
    var currentPage = req.params.defaultUrl;
    var targetObj = adminBean.getTargetObj(currentPage);
    var params = url.parse(req.url,true);
    var targetId = params.query.uid;

    if(targetObj == AdminUser){
        //使用getOneItem中间截获返回结果，findOne不能截获
        AdminUser.getOneItem(res,targetId,function(user){
            user.password = "";
            return res.json(user);
        });
    }else{
        DBOpt.findOne(targetObj,req, res,"find one obj success");
    }

});

//-------------------------获取单个对象数据结束-------------------------


//-------------------------对象列表查询开始(带分页)-------------------------------

router.get('/manage/getDocumentList/:defaultUrl',function(req,res){
    var targetObj = adminBean.getTargetObj(req.params.defaultUrl);
    DBOpt.pagination(targetObj,req, res);
});


//-------------------------对象列表查询结束(带分页)-------------------------------

//-------------------------对象删除开始-------------------------

router.get('/manage/:defaultUrl/del',function(req,res){
    var currentPage = req.params.defaultUrl;
    var params = url.parse(req.url,true);
    var targetObj = adminBean.getTargetObj(currentPage);

    if(targetObj == AdminUser){
        if(params.query.uid == req.session.adminUserInfo._id){
            res.status(400).end('不能删除当前登录的管理员！');
        }else{
            DBOpt.del(targetObj,req,res,"del one obj success");
        }
    }else if(targetObj == AdminGroup){
        if(params.query.uid == req.session.adminUserInfo.group._id){
            res.status(400).end('当前用户拥有的权限信息不能删除！');
        }else{
            DBOpt.del(targetObj,req,res,"del one obj success");
        }
    }else{
        targetObj.findOne({_id : params.query.uid},function(err,data){
            if(data && ('file_path' in data)){
                console.log("delete file from mongo");
                DBOpt.removeFile(data.file_path);
            }  
        });
        DBOpt.del(targetObj,req,res,"del one obj success");
    }

});
//-------------------------更新单条记录(执行更新)开始--------------------
router.post('/manage/:defaultUrl/modify',function(req,res){
    var currentPage = req.params.defaultUrl;
    var targetObj = adminBean.getTargetObj(currentPage);
    req.body = req.query;

    if(targetObj == AdminUser){
        pass.hash(req.body.password, function(err, salt, hash){
            req.body.password = hash;
            req.body.salt = salt;
            DBOpt.updateOneByID(targetObj,req, res,"update one obj success")
        }); 
    }else{
        if('file' in req.files){
            console.log("change file in mongo");
            targetObj.findOne({_id : req.body._id},function(err,data){
                DBOpt.removeFile(data.file_path);
            });
             // 保存文件到GridFS，必须在保存完成后返回res,否则响应不同步
             var file = req.files['file'];
             req.body["file_path"] = file.name;
             DBOpt.loadToMongo(file.name,file.originalname,req.body.bigCategory,file.path,function(){
                DBOpt.updateOneByID(targetObj,req, res,"update one obj success");
            });
         }else{
            DBOpt.updateOneByID(targetObj,req, res,"update one obj success");
        }
    }
});
//-------------------------更新单条记录(执行更新)结束--------------------

//-------------------------获取所有数据开始--------------------
//一般用于下拉列表的显示，特点是不需要populate
router.get('/manage/:defaultUrl/findAll',function(req,res){
    var currentPage = req.params.defaultUrl;
    var targetObj = adminBean.getTargetObj(currentPage);
    DBOpt.findAll(targetObj,req, res,"findAll one obj success")
});
//-------------------------获取所有数据结束--------------------
//-------------------------对象新增开始-------------------------
router.post('/manage/:defaultUrl/addOne',function(req,res){
    var currentPage = req.params.defaultUrl;
    var targetObj = adminBean.getTargetObj(currentPage);
    req.body = req.query;
    if(targetObj == AdminUser){
        addOneAdminUser(req,res);
    }else{
        if('file' in req.files){
            console.log("save file to mongo");
             // 保存文件到GridFS 
             var file = req.files['file'];
             req.body["file_path"] = file.name;
             DBOpt.loadToMongo(file.name,file.originalname,req.body.bigCategory,file.path,function(){
                DBOpt.addOne(targetObj,req,res);
            });
         }else{
            DBOpt.addOne(targetObj,req, res);
        }  
    }
});

//-------------------------对象新增结束-------------------------

//添加系统用户
function addOneAdminUser(req,res){

    var errors;
    var userName = req.body.userName;
    if(validator.isUserName(userName)){
        pass.hash(req.body.password, function(err, salt, hash){
            req.body.password = hash;
            req.body.salt = salt;
            DBOpt.addOne(AdminUser,req, res);
        });
    }else{
        res.status(400).end(settings.system_illegal_param);
    }
}

function setPageInfo(req,res,module){

    return {
        siteInfo : module[1],
        bigCategory : module[0],
        currentLink : req.originalUrl,
        layout : 'admin/index'
    }
}
module.exports = router;