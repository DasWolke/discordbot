/**
 * Created by julia on 14.07.2016.
 */
var yt = require('./youtube');
var voice = require('../voice');
var songModel = require('../../DB/song');
var queueModel = require('../../DB/queue');
var path = require('path');
var ytDlAndPlayFirst = function (message, messageSearch) {
    songModel.findOne({url: messageSearch.trim()}, function (err, Song) {
        if (err) {
            console.log(err);
            return message.reply('Internal Error');
        }
        if (Song) {
            if (voice.inVoice(message)) {
                queueModel.findOne({id:message.guild.id}, (err, Queue) => {
                    if (err) return console.log(err);
                    if (Queue && Queue.songs[0].id === Song.id) {
                        message.reply('This Song is already playing!');
                    } else {
                        voice.addSongFirst(message, Song, false).then(() => {
                            voice.playSong(message, Song);
                        }).catch(console.log);
                    }
                });
            } else {
                message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
            }
        } else {
            message.reply('Started Download!');
            yt.download(messageSearch.trim(), message, function (err, info) {
                if (err) {
                    return message.reply("This Video seems to be blocked or Removed or is to long <" + messageSearch.trim() + ">");
                }
                message.reply('Found Song and Downloaded it! ' + info.title);
                songModel.findOne({id: info.id}, function (err, Song) {
                    if (err) return console.log(err);
                    if (Song) {
                        if (voice.inVoice(message)) {
                            voice.addSongFirst(message, Song, false).then(() => {
                                voice.playSong(message, Song);
                            }).catch(message.reply);
                        } else {
                            message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                        }
                    } else {
                        message.reply('Seems like a Error happened...');
                    }
                });
            });
        }
    });
};
var ytDlAndQueue = function (message, messageSearch, messageSplit) {
    songModel.findOne({url: messageSearch.trim()}, function (err, Song) {
        if (err) {
            console.log(err);
            return message.reply('Internal Error');
        }
        if (Song) {
            if (voice.inVoice(message)) {
                voice.addToQueue(message,Song);
            } else {
                message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
            }
        } else {
            message.reply('Started Download!');
            yt.download(messageSearch.trim(), message, function (err, info) {
                if (err) {
                    return message.reply("This Video seems to be blocked or Removed or is to long <" + messageSearch.trim() + ">");
                }
                songModel.findOne({id: info.id}, function (err, Song) {
                    if (err) return console.log(err);
                    if (Song) {
                        if (voice.inVoice(message)) {
                            voice.addToQueue(message,Song).then((reply) => {
                                message.reply(reply);
                            }).catch(message.reply);
                        } else {
                            message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                        }
                    } else {
                        message.reply('Seems like a Error happened...');
                    }
                });
            });
        }
    });
};
var ytDlAndPlayForever = function (message, messageSearch) {
    songModel.findOne({url: messageSearch.trim()}, function (err, Song) {
        if (err) {
            console.log(err);
            return message.reply('Internal Error');
        }
        if (Song) {
            if (voice.inVoice(message)) {
                voice.queueAddRepeat(message,Song);
            } else {
                message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
            }
        } else {
            message.reply('Started Download!');
            yt.download(messageSearch.trim(), message, function (err, info) {
                if (err) {
                    return message.reply("This Video seems to be blocked or Removed or is to long <" + messageSearch.trim() + ">");
                }
                message.reply('Found Song and Downloaded it! ' + info.title);
                songModel.findOne({id: info.id}, function (err, Song) {
                    if (err) return console.log(err);
                    if (Song) {
                        if (voice.inVoice(message)) {
                            voice.queueAddRepeat(message,Song);
                        } else {
                            message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                        }
                    } else {
                        message.reply('Seems like a Error happened...');
                    }
                });
            });
        }
    });
};
module.exports = {ytDlAndPlayFirst: ytDlAndPlayFirst,ytDlAndPlayForever:ytDlAndPlayForever, ytDlAndQueue:ytDlAndQueue};