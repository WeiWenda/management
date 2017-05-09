var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
//模板引擎
var partials = require('express-partials');

var adminServer = require('./routes/adminServer');
var admin = require('./routes/admin');
var log4js = require('log4js');
var log = log4js.getLogger("app");
var io = require('socket.io')();
var createLineReader = require('./utils/WatchFile');
/*实例化express对象*/
var app = express();
//session配置
app.use(session({
    secret: 'caibojian',
    resave: false,
    saveUninitialized: true
}));

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
app.use(bodyParser.json({limit: '50mb'})); // 限制上传5M
app.use(bodyParser.urlencoded({ extended: true , limit: '50mb' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

app.use(function(req, res, next){
//    针对注册会员
    res.locals.logined = req.session.logined;
    res.locals.userInfo = req.session.user;
//    针对管理员
    res.locals.adminlogined = req.session.adminlogined;
    res.locals.adminUserInfo = req.session.adminUserInfo;
    res.locals.adminNotices = req.session.adminNotices;
//    指定站点域名
    res.locals.myDomain = req.headers.host;
    next();
});
//监听日志变化
var read = new createLineReader(path.join(__dirname, 'log/app.log'));

//事件监听
app.io = io;

io.on('connection', function(client){

    read.on('line', function(line){
        var arr = line.toString().split(" ");
        if(arr.length>4){
            var returnlog = {
                time: arr[0]+" "+arr[1],
                level: arr[2],
                type: arr[3],
                msg: arr.slice(4)
            }
            client.emit('logChange', returnlog);
        }
    });
    client.emit('connect', 'connection');
    // 监听发送消息
    client.on('send.message', function(msg){
    });
    // 断开连接时，通知其它用户
    client.on('disconnect', function(){
    })

})

/*指定路由控制*/
app.use('/admin', admin);
app.use('/admin', adminServer);


module.exports = app;