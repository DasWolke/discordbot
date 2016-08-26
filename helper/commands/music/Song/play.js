/**
 * Created by julia on 24.07.2016.
 */
var songModel = require('../../../../DB/song');
var voice = require('../../../utility/voice');
var ytHelper = require('../../../youtube/helper');
var messageHelper = require('../../../utility/message');
var playCMD = function playCmd(bot, message, messageSplit) {
    if (!message.channel.isPrivate) {
        if (messageHelper.hasWolkeBot(bot,message)) {
            if (typeof (messageSplit[1]) !== 'undefined') {
                var messageSearch = "";
                for (var i = 1; i < messageSplit.length; i++) {
                    messageSearch = messageSearch + " " + messageSplit[i]
                }
                if (voice.checkMedia(messageSearch)) {
                    ytHelper.ytDlAndPlayFirst(bot, message, messageSearch, messageSplit);
                }  else {
                    songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec(function (err, Songs) {
                        if (err) return console.log(err);
                        var Song = Songs[0];
                        if (Song) {
                            if (voice.inVoice(bot, message)) {
                                voice.addSongFirst(bot, message, Song, false, function (err) {
                                    if (err) return console.log(err);
                                    voice.playSong(bot, message, Song);
                                });
                            } else {
                                bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                            }
                        } else {
                            bot.reply(message, 'No Song Found!');
                        }
                    });
                }
            } else {
                bot.reply(message, 'No Search term entered!');
            }
        } else {
            bot.reply(message, 'No Permission to use this Command! Use !w.qa instead!');
        }
    } else {
        bot.reply(message, "This Commands Only Works in Server Channels!");
    }
};
module.exports = playCMD;