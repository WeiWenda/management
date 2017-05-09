/**
 * Created by cbj on 2016/1/9.
 * 员用户组对象
 */

var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

//mongoose.connect("mongodb://localhost/doracms")

var PersonSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name:  String,
    english_name: String,
    comments : String
});


var Person = mongoose.model("Person",PersonSchema);

module.exports = Person;
