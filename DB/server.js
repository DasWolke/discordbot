/**
 * Created by julia on 26.06.2016.
 */
var mongoose = require('mongoose');
var serverSchema = mongoose.Schema({
    id:String,
    adminRole:String
});
var serverModel = mongoose.model('Settings', serverSchema);
module.exports = serverModel;