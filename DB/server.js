/**
 * Created by julia on 26.06.2016.
 */
var mongoose = require('mongoose');
var serverSchema = mongoose.Schema({
    id:String,
    lastVoiceChannel:String,
    nsfwChannel:String,
    cmdChannel:String,
    permissions:[],
    prefix:String,
    disabledCmds:[],
    Groups:[],
    Blacklist:[]
});
serverSchema.methods.updateVoice = function updateVoice(id,cb) {
    this.model('Servers').update({id:this.id}, {$set:{lastVoiceChannel:id}}, cb);
};
serverSchema.methods.updateNsfw = function updateNsfw(id,cb) {
    this.model('Servers').update({id:this.id}, {$set:{nsfwChannel:id}}, cb);
};
serverSchema.methods.updateCmd = function updateCmd(id,cb) {
    this.model('Servers').update({id:this.id}, {$set:{cmdChannel:id}}, cb);
};
var serverModel = mongoose.model('Servers', serverSchema);
module.exports = serverModel;