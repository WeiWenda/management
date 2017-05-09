/**
 * Created by cbj on 2016/1/9.
 * 员用户组对象
 */

var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

//mongoose.connect("mongodb://localhost/doracms")

var DirectionSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name:  String,
    comments : String
});


var Direction = mongoose.model("Direction",DirectionSchema);

module.exports = Direction;
