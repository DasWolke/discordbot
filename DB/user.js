/**
 * Created by julia on 23.07.2016.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    id: String,
    name: String,
    level: Number,
    levelEnabled:Boolean,
    xp: Number,
    avatar: String,
    created: Date,
    banned: Boolean,
    favorites:[]
});
userSchema.methods.updateXP = function updateXP(cb) {
    this.model('Users').update({id:this.id}, {$inc: {xp: 2}}, cb);
};
userSchema.methods.updateLevel = function updateLevel(cb) {
    this.model('Users').update({id:this.id}, {$set: {xp: 0}, $inc:{level:1}}, cb);
};
userSchema.methods.updateFavorites = function updateFavorites(id,cb) {
    this.model('Users').update({id:this.id}, {favorites:{$addToSet:id}}, cb);
};
userSchema.methods.disableLevel = function disableLevel(cb) {
    this.model('Users').update({id:this.id}, {$set:{levelEnabled:false}}, cb);
};
userSchema.methods.enableLevel = function enableLevel(cb) {
    this.model('Users').update({id:this.id}, {$set:{levelEnabled:true}}, cb);
};
var userModel = mongoose.model('Users', userSchema);
module.exports = userModel;