/**
 * Created by cbj on 2016/1/9.
 * 员用户组对象
 */

var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

//mongoose.connect("mongodb://localhost/doracms")

var CCFLevelSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    abbreviation:String,
    name:  String,
    level: String,
    comments : String
});


var CCFLevel = mongoose.model("CCFLevel",CCFLevelSchema);

module.exports = CCFLevel;
