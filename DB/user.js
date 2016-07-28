/**
 * Created by julia on 23.07.2016.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    id: String,
    name: String,
    level: Number,
    xp: Number,
    avatar: String,
    created: Date,
    banned: Boolean
});
userSchema.methods.updateXP = function updateXP(cb) {
    this.model('Users').update({id:this.id}, {$inc: {xp: 2}}, cb);
};
userSchema.methods.updateLevel = function updateLevel(cb) {
    this.model('Users').update({id:this.id}, {$set: {xp: 0}, $inc:{level:1}}, cb);
};
var userModel = mongoose.model('Users', userSchema);
module.exports = userModel;