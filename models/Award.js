/**
 *后台管理元用户
 **/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//id生成器
var shortid = require('shortid');

var AwardSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name: String,
    winner: [{type:String,ref:'Person'}],
    file_name:String,
    file_path: String,
    time: {type: Date, default: Date.now },
    comments: {type:String,default:""},
    type: {
        type : String,
        ref : 'AwardLevel'
    }
});

var Award = mongoose.model("Award", AwardSchema);

module.exports = Award;