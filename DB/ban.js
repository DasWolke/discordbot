/**
 * Created by julia on 24.08.2016.
 */
var mongoose = require('mongoose');
var banSchema = mongoose.Schema({
    id: String,
    serverId:String,
    name: String,
    bannedBy:String,
    bannedByName:String,
    reason:String,
    time: {type:Date, default:Date.now}
});
var banModel = mongoose.model('Bans', banSchema);
module.exports = banModel;