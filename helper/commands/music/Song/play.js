/**
 * Created by julia on 24.07.2016.
 */
var songModel = require('../../../../DB/song');
var voice = require('../../../../utility/voice');
var ytHelper = require('../../../youtube/helper');
var messageHelper = require('../../../../utility/message');
var musicHelper = require('../../../../utility/music');
var osu = require('../../../utility/osu');
var playCMD = function playCmd(message, messageSplit) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message)) {
            if (typeof (messageSplit[1]) !== 'undefined') {
                var messageSearch = "";
                for (var i = 1; i < messageSplit.length; i++) {
                    messageSearch = messageSearch + " " + messageSplit[i]
                }
                if (musicHelper.checkMedia(messageSearch)) {
                    ytHelper.ytDlAndPlayFirst(message, messageSearch, messageSplit);
                } else if (musicHelper.checkOsuMap(messageSplit[1])) {
                    osu.download(message).then(Song => {
                        if (voice.inVoice(message)) {
                            voice.addSongFirst(message, Song, false, function (err) {
                                if (err) return console.log(err);
                                voice.playSong(message, Song);
                            });
                        } else {
                            message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                        }
                    }).catch(message.reply);
                } else {
                    songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec(function (err, Songs) {
                        if (err) return console.log(err);
                        var Song = Songs[0];
                        if (Song) {
                            if (voice.inVoice(message)) {
                                voice.addSongFirst(message, Song, false, function (err) {
                                    if (err) return console.log(err);
                                    voice.playSong(message, Song);
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
            message.reply('No Permission to use this Command! Use !w.qa instead!');
        }
    } else {
        message.reply("This Commands Only Works in Server Channels!");
    }
};
module.exports = playCMD;