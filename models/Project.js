/**
 *后台管理元用户
 **/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//id生成器
var shortid = require('shortid');

var ProjectSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name: String,
    principal: { type:String,ref:'Person'},
    start_time: {type: Date, default: Date.now },
    end_time:Date,
    number:String,
    comments: {type:String,default:""},
    money:String,
    type: {
        type : String,
        ref : 'ProjectLevel'
    }
});


var Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;