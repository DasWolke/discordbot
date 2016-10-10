/**
 * Created by julia on 26.06.2016.
 */
var mongoose = require('mongoose');
var serverSchema = mongoose.Schema({
    id:String,
    lastVoiceChannel:String,
    nsfwChannel:String,
    nsfwChannels:[],
    cmdChannels:[],
    ignoreChannels:[],
    permissions:[],
    prefix:String,
    disabledCmds:[],
    levelUpRewards:[],
    Groups:[],
    Blacklist:[],
    levelEnabled:Boolean,
    pmNotifications:Boolean
});
serverSchema.methods.updateVoice = function updateVoice(id,cb) {
    this.model('Servers').update({id:this.id}, {$set:{lastVoiceChannel:id}}, cb);
};
serverSchema.methods.updateNsfw = function updateNsfw(id,cb) {
    this.model('Servers').update({id:this.id}, {$set:{nsfwChannel:id}}, cb);
};
serverSchema.methods.updatePms = function updatePms(bool,cb) {
    this.model('Servers').update({id:this.id}, {$set:{pmNotifications:bool}}, cb);
};
serverSchema.methods.updateLevels = function updateLevels(bool,cb) {
    this.model('Servers').update({id:this.id}, {$set:{levelEnabled:bool}}, cb);
};
serverSchema.methods.updatePrefix = function updatePrefix(prefix,cb) {
    this.model('Servers').update({id:this.id}, {$set:{prefix:prefix}}, cb);
};
var serverModel = mongoose.model('Servers', serverSchema);
module.exports = serverModel;