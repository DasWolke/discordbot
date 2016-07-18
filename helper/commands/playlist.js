/**
 * Created by julia on 10.07.2016.
 */
var createPlaylist = require('./playlist/createPlaylist');
var addPlaylist = require('./playlist/addToPlaylist');
var playlistCommands = function playlistCommands(bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.playlist":
            if (messageSplit[1] === "create") {
                createPlaylist(bot, message);
            }
            if (messageSplit[1] === "add") {
                addPlaylist(bot,message);
            }
            if (messageSplit[1] === "edit") {

            }
            if (messageSplit[1] === "remove") {

            }
            if (messageSplit[1] === "search") {

            }
            if (messageSplit[1] === "top") {

            }
            if (!messageSplit[1]) {
                var reply = 'What do you want to do ?\n\n' +
                    '- `!w.playlist create name` creates a Playlist with the given Name\n\n' +
                    '- `!w.playlist edit name` edit a Playlist\n\n' +
                    '- `!w.playlist remove name` deletes a Playlist \n\n' +
                    '- `!w.playlist search searchterm` searches a Playlist by Name\n\n' +
                    '- `!w.playlist top` lists the top 5 most played Playlists';
                bot.reply(message, reply);
            }
            return;
        default:
            return;
    }

};
module.exports = playlistCommands;