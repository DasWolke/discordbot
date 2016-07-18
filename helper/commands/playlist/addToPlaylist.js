/**
 * Created by julia on 14.07.2016.
 */
var playlistModel = require('../../../DB/playlist');
var addToPlaylist = function addToPlaylist(bot,message) {
    var messageSplit = message.content.split(' ');
    var messageCleaned = "";
    if (typeof(messageSplit[1]) !== 'undefined' && messageSplit[1]) {
        for (var i = 2; i < messageSplit.length;i++) {
            messageCleaned = messageCleaned + " " + messageSplit[i];
        }
        var messageCommaSep = messageCleaned.split(',');
        console.log(messageCommaSep);
    } else {
        bot.reply(message, 'You have to add at least one Song!');
    }
};
module.exports = addToPlaylist;