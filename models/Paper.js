/**
 *后台管理元用户
 **/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//id生成器
var shortid = require('shortid');

var PaperSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name: String,
    author: [{type:String,ref:'Person'}],
    project:[{type:String,ref:'Project'}],
    file_path: String,
    publish_time: {type: Date, default: Date.now },
    wos_number:String,
    ei_number:String,
    type:{type:String,ref:'CCFLevel'},
    comments: {type:String,default:""},
    direction: {
        type : String,
        ref : 'Direction'
    }
});

var Paper = mongoose.model("Paper", PaperSchema);

module.exports = Paper;