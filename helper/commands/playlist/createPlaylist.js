/**
 * Created by julia on 10.07.2016.
 */
var playlistModel = require('../../../DB/playlist');
var shortid = require('shortid');
var createPlaylist = function createPlaylist(bot, message) {
    var messageSplit = message.content.split(' ');
    if (typeof (messageSplit[2]) !== 'undefined' && messageSplit[2]) {
        var playlistName = "";
        var open = false;
        for (var i = 2; i < messageSplit.length; i++) {
            if (i !== messageSplit.length && messageSplit[i] !== 'public') {
                playlistName = playlistName + messageSplit[i] + " ";
            } else {
                open = true;
            }
        }
        playlistModel.findOne({createdBy:message.author.id, title:playlistName}, function (err, Playlist) {
            if (err) return console.log(err);
            if (Playlist) {
                return bot.reply(message, 'You already have a playlist with the name ' + playlistName);
            } else {
                var playlist = new playlistModel({
                    title: playlistName,
                    createdBy: message.author.id,
                    createdAt: Date.now(),
                    id: shortid.generate(),
                    public: open,
                    songs: []
                });
                playlist.save(function (err) {
                    if (err) return console.log(err);
                    var reply = "Created private Playlist " + playlistName;
                    if (open) {
                        reply = "Created public Playlist " + playlistName;
                    }
                    return bot.reply(message, reply);
                });
            }
        });
    } else {
        return bot.reply(message, 'You did not enter a Name for the Playlist!');
    }
};
module.exports = createPlaylist;