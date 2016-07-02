/**
 * Created by julia on 26.06.2016.
 */
var mongoose = require('mongoose');
var songSchema = mongoose.Schema({
    title:String,
    path:String,
    addedBy:String,
    id:String,
    type:String
});
var songModel = mongoose.model('Settings', songSchema);
module.exports = songModel;
