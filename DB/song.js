/**
 * Created by julia on 26.06.2016.
 */
var mongoose = require('mongoose');
var songSchema = mongoose.Schema({
    title:String,
    alt_title:String,
    path:String,
    addedBy:String,
    addedAt:Date,
    id:String,
    type:String,
    url:String,
    setId:String,
    dl:String
});
var songModel = mongoose.model('Songs', songSchema);
module.exports = songModel;