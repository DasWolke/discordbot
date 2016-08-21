/**
 * Created by julia on 16.08.2016.
 */
/**
 * Created by julia on 24.07.2016.
 */
var songModel = require('../../../../DB/song');
var voice = require('../../../utility/voice');
var ytHelper = require('../../../youtube/helper');
var YoutubeReg = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)(&.*|)/g;
var foreverCMD = function foreverCmd(bot,message, messageSplit) {
    if (!message.channel.isPrivate) {
        var admin = false;
        for (var role of message.server.rolesOfUser(message.author)) {
            if (role.name === 'WolkeBot') {
                admin = true;
            }
            if (role.name === 'Proxerteam') {
                admin = true;
            }
        }
        if (message.server.id === '118689714319392769' && admin || message.server.id === "166242205038673920" && admin || message.server.id !== "166242205038673920" && message.server.id !== '118689714319392769') {
            if (typeof (messageSplit[1]) !== 'undefined') {
                var messageSearch = "";
                for (var i = 1; i < messageSplit.length; i++) {
                    messageSearch = messageSearch + " " + messageSplit[i]
                }
                if (YoutubeReg.test(messageSearch)) {
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
            bot.reply(message, 'No Permission to use this Command!');
        }
    } else {
        bot.reply(message, "This Commands Only Works in Server Channels!");
    }
};
module.exports = foreverCMD;