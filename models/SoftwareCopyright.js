/**
 *后台管理元用户
 **/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//id生成器
var shortid = require('shortid');

var SoftwareCopyrightSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name: String,
    file_name:String,
    file_path: String,
    finish_time:{type: Date, default: Date.now },
    register_number:String,
    comments: {type:String,default:""},
    direction: {
        type : String,
        ref : 'Direction'
    }
});

var SoftwareCopyright = mongoose.model("SoftwareCopyright", SoftwareCopyrightSchema);

module.exports = SoftwareCopyright;