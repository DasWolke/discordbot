/**
 * Created by julia on 26.06.2016.
 */
var mongoose = require('mongoose');
var playlistSchema = mongoose.Schema({
    title:String,
    createdBy:String,
    serverPlaylist:Boolean,
    createdAt:Date,
    id:String,
    public:Boolean,
    songs:[]

});
var playlistModel = mongoose.model('Playlists', playlistSchema);
module.exports = playlistModel;
