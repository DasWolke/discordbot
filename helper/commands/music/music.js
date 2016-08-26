/**
 * Created by julia on 26.06.2016.
 */
var songHelper = require('../../utility/music/songs');
var songModel = require('../../../DB/song');
var queueModel = require('../../../DB/queue');
var path = require('path');
var getOsu = require('./osu');
var voice = require('../../utility/voice');
var general = require('../../utility/general');
var song = require('./Song/Song.CMD');
var queueCmd = require('./Queue/Queue.CMD');
var messageHelper = require('../../utility/message');
var musicCommands = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.play":
            song.play(bot, message, messageSplit);
            return;
        case "!w.np":
            song.now(bot,message);
            return;
        case "!w.osu":
            getOsu(bot, message, messageSplit[1]);
            return;
        case "!w.pause":
            song.pause(bot, message);
            return;
        case "!w.resume":
            song.resume(bot, message);
            return;
        case"!w.search":
            song.search(bot, message, messageSplit);
            return;
        case "!w.queue":
            queueCmd.main(bot, message, messageSplit);
            return;
        case "!w.qa":
            queueCmd.add(bot, message, messageSplit);
            return;
        case "!w.qrl":
            queueCmd.remove(bot,message,messageSplit);
            return;
        case "!w.forever":
            song.forever(bot,message,messageSplit);
            return;
        case "!w.skip":
            if (!message.channel.isPrivate) {
                if (voice.inVoice(bot, message)) {
                    if(messageHelper.hasWolkeBot(bot,message)) {
                    queueModel.findOne({server: message.server.id}, function (err, Queue) {
                            if (err) return console.log(err);
                            var connection = voice.getVoiceConnection(bot, message);
                            if (Queue) {
                                if (Queue.songs.length > 0) {
                                    Queue.stopRepeat(function (err) {
                                        if (err) return console.log(err);
                                        voice.nextSong(bot, message, Queue.songs[0], false);
                                        bot.reply(message, "Skipped Song " + Queue.songs[0].title);
                                    });
                                } else {
                                    if (connection && connection.playing) {
                                        connection.stopPlaying();
                                        bot.reply(message, "Stopped current Song!");
                                    } else {
                                        bot.reply(message, 'There is no Song playing right now!');
                                    }
                                }
                            } else {
                                if (connection && connection.playing) {
                                    connection.stopPlaying();
                                    bot.reply(message, "Stopped current Song!");
                                } else {
                                    bot.reply(message, 'There is no Song in the Queue right now!');
                                }
                            }
                        });
                    } else {
                        bot.reply(message, 'No Permission! Use !w.voteskip or give yourself the WolkeBot Role.');
                    }
                } else {
                    bot.reply(message, "I am not connected to any Voice Channel on this Server!");
                }
            } else {
                bot.reply(message, 'This Command does not work in private Channels');
            }
            return;
        case "!w.random":
            if (!message.channel.isPrivate) {
                if (message.hasWolkeBot(bot,message)) {

                    songModel.count({}, function (err, C) {
                        if (err) return bot.reply(message, "A Database Error occured!");
                        var random = general.random(0, C);
                        songModel.find({}, function (err, Songs) {
                            if (err) return console.log(err);
                            if (typeof(Songs[random]) !== 'undefined') {
                                var Song = Songs[random];
                                if (voice.inVoice(bot, message)) {
                                    voice.addSongFirst(bot, message, Song, false,function (err) {
                                        if (err) return console.log(err);
                                        voice.playSong(bot, message, Song);
                                    });
                                } else {
                                    bot.reply(message, "I am not connected to any Voice Channel on this Server!");
                                }
                            } else {
                                bot.reply(message, 'A Error occured!');
                            }
                        });
                    });
                } else {
                    bot.reply(message, 'No Permission! You need to use !w.rq or give yourself the WolkeBot Role to use this.');
                }
            } else {
                bot.reply(message, 'This Command does not work in private Channels');
            }
            return;
        case "!w.rq":
            if (!message.channel.isPrivate) {
                songModel.count({}, function (err, C) {
                    if (err) return bot.reply(message, "A Database Error occured!");
                    var random = general.random(0, C);
                    songModel.find({}, function (err, Songs) {
                        if (err) return console.log(err);
                        if (typeof(Songs[random]) !== 'undefined') {
                            var Song = Songs[random];
                            if (voice.inVoice(bot, message)) {
                                voice.addToQueue(bot, message, Song);
                            } else {
                                bot.reply(message, "I am not connected to any Voice Channel on this Server!");
                            }
                        } else {
                            bot.reply(message, 'A Error occured!');
                        }
                    });
                });
            } else {
                bot.reply(message, 'This Command does not work in private Channels');
            }
            return;
        case "!w.voteskip":
            if (!message.channel.isPrivate) {
                songHelper.voteSkip(bot, message, function (err, response) {
                    if (err) {
                        return bot.reply(message, err);
                    }
                    bot.reply(message, response);
                });
            } else {
                bot.reply(message, 'This Command does not work in private Channels');
            }
            return;
        case "!w.volume":
            if (!message.channel.isPrivate) {
                if (messageHelper.hasWolkeBot(bot,message)) {

                    voice.setVolume(bot, message, function (err, response) {
                        if (err) return bot.reply(message, err);
                        bot.reply(message, response);
                    });
                } else {
                    bot.reply(message, 'No Permission! You need to give yourself the WolkeBot Role to use this.');
                }
            } else {
                bot.reply(message, 'This Command does not work in private Channels');
            }
            return;
        case "!w.down":
            return;
        case "!w.up":
            return;
        case "!w.fav":
            return;
        // case "!w.stream":
        //     if (!message.channel.isPrivate) {
        //         if (voice.inVoice(bot, message)) {
        //             voice.stream(bot, message, messageSplit[1]);
        //         } else {
        //             bot.reply(message, 'Connect me to Voice.');
        //         }
        //     } else {
        //         bot.reply(message, 'This Command only works in Servers');
        //     }
        //     return;
        default:
            return;
    }
};
module.exports = musicCommands;