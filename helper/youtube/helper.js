/**
 * Created by julia on 14.07.2016.
 */
var yt = require('./youtube');
var voice = require('../utility/voice');
var songModel = require('../../DB/song');
var path = require('path');
var ytDlAndPlayFirst = function (bot, message, messageSearch, messageSplit) {
    songModel.findOne({url: messageSearch.trim()}, function (err, Song) {
        if (err) {
            console.log(err);
            return bot.reply(message, 'Internal Error');
        }
        if (Song) {
            if (voice.inVoice(bot, message)) {
                voice.addSongFirst(bot, message, Song, function (err) {
                    if (err) return console.log(err);
                    voice.playSong(bot, message, Song);
                });
            } else {
                bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
            }
        } else {
            yt.download(messageSplit[1], message, function (err, info) {
                if (err) {
                    console.log(err);
                    return bot.reply(message, "This Video seems to be blocked or Removed <" + messageSplit[1] + ">");
                }
                bot.reply(message, 'Found Song and Downloaded it! ' + info.title);
                songModel.findOne({id: info.id}, function (err, Song) {
                    if (err) return console.log(err);
                    if (Song) {
                        if (voice.inVoice(bot, message)) {
                            voice.addSongFirst(bot, message, Song, function (err) {
                                if (err) return console.log(err);
                                voice.playSong(bot, message, Song);
                            });
                        } else {
                            bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                        }
                    } else {
                        bot.reply(message, 'Seems like a Error happened...');
                    }
                });
            });
        }
    });
};
var ytDlAndQueue = function (bot, message, messageSearch, messageSplit) {
    songModel.findOne({url: messageSearch.trim()}, function (err, Song) {
        if (err) {
            console.log(err);
            return bot.reply(message, 'Internal Error');
        }
        if (Song) {
            if (voice.inVoice(bot, message)) {
                voice.addToQueue(bot,message,Song);
            } else {
                bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
            }
        } else {
            yt.download(messageSplit[1], message, function (err, info) {
                if (err) {
                    console.log(err);
                    return bot.reply(message, "This Video seems to be blocked or Removed <" + messageSplit[1] + ">");
                }
                songModel.findOne({id: info.id}, function (err, Song) {
                    if (err) return console.log(err);
                    if (Song) {
                        if (voice.inVoice(bot, message)) {
                            voice.addToQueue(bot,message,Song);
                        } else {
                            bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                        }
                    } else {
                        bot.reply(message, 'Seems like a Error happened...');
                    }
                });
            });
        }
    });
};
module.exports = {ytDlAndPlayFirst: ytDlAndPlayFirst, ytDlAndQueue:ytDlAndQueue};