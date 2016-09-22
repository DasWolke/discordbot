/**
 * Created by julia on 16.08.2016.
 */
/**
 * Created by julia on 24.07.2016.
 */
var songModel = require('../../../../DB/song');
var voice = require('../../../utility/voice');
var ytHelper = require('../../../youtube/helper');
var messageHelper = require('../../../utility/message');
var foreverCMD = function foreverCmd(bot,message, messageSplit) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(bot,message)) {
            if (typeof (messageSplit[1]) !== 'undefined') {
                var messageSearch = "";
                for (var i = 1; i < messageSplit.length; i++) {
                    messageSearch = messageSearch + " " + messageSplit[i];
                }
                if (voice.checkMedia(messageSearch)) {
                    ytHelper.ytDlAndPlayForever(bot, message, messageSearch, messageSplit);
                } else {
                    songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec(function (err, Songs) {
                        if (err) return console.log(err);
                        var Song = Songs[0];
                        if (Song) {
                            if (voice.inVoice(bot, message)) {
                                voice.addSongFirst(bot, message, Song, true, function (err) {
                                    if (err) return console.log(err);
                                    voice.playSong(bot, message, Song);
                                });
                            } else {
                                message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                            }
                        } else {
                            message.reply('No Song Found!');
                        }
                    });
                }
            } else {
                message.reply('No Search term entered!');
            }
        } else {
            message.reply('No Permission! You need to give yourself the WolkeBot Role to use this.');
        }
    } else {
        message.reply("This Commands Only Works in Server Channels!");
    }
};
module.exports = foreverCMD;