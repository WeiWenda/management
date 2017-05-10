/**
 * Created by cbj on 2016/1/9.
 * 员用户组对象
 */

var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

//mongoose.connect("mongodb://localhost/doracms")

var AwardLevelSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name:  String,
    level: String,
    comments : String
});


var AwardLevel = mongoose.model("AwardLevel",AwardLevelSchema);

module.exports = AwardLevel;
