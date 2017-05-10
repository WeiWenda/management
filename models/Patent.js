/**
 *后台管理元用户
 **/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//id生成器
var shortid = require('shortid');

var PatentSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name: String,
    owner: [{type:String,ref:'Person'}],
    file_path: String,
    apply_time: {type: Date, default: Date.now },
    apply_number:String,
    authorized_time:Date,
    authorized_number:String,
    comments: {type:String,default:""},
    direction: {
        type : String,
        ref : 'Direction'
    }
});
PatentSchema.statics = {
    getOneItem: function(res, targetId, callBack){
        Patent.findOne({'_id': targetId}).populate('owner').populate('direction').exec(function(err, patent){
            if(err){
                res.end(err);
            }
            callBack(patent);
        })
    }
};

var Patent = mongoose.model("Patent", PatentSchema);

module.exports = Patent;