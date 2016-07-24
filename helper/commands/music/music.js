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
var musicCommands = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.play":
            song.play(bot, message, messageSplit);
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
            queueCmd(bot, message, messageSplit);
            return;
        case "!w.skip":
            if (!message.channel.isPrivate) {
                if (voice.inVoice(bot, message)) {
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
                        queueModel.findOne({server: message.server.id}, function (err, Queue) {
                            if (err) return console.log(err);
                            var connection = voice.getVoiceConnection(bot, message);
                            if (Queue) {
                                if (Queue.songs.length > 0) {
                                    voice.nextSong(bot, message, Queue.songs[0]);
                                    bot.reply(message, "Skipped Song " + Queue.songs[0].title);
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
                        bot.reply(message, 'No Permission!');
                    }
                } else {
                    bot.reply(message, "I am not connected to any Voice Channel on this Server!");
                }
            } else {
                bot.reply(message, 'This Command does not work in private Channels');
            }
            return;
        // case "!w.clearqueue":
        //     var admin = false;
        //     for (var role of message.server.rolesOfUser(message.author)) {
        //         if (role.name === 'WolkeBot') {
        //             admin = true;
        //         }
        //     }
        //     if (message.server.id === '118689714319392769' && admin || message.server.id !== '118689714319392769') {
        //
        //     }
        //     return;
        // case "!w.shuffle":
        //     return;
        case "!w.random":
            if (!message.channel.isPrivate) {
                songModel.count({}, function (err, C) {
                    if (err) return bot.reply(message, "A Database Error occured!");
                    var random = general.random(0, C);
                    songModel.find({}, function (err, Songs) {
                        if (err) return console.log(err);
                        if (typeof(Songs[random]) !== 'undefined') {
                            var Song = Songs[random];
                            if (voice.inVoice(bot, message)) {
                                voice.addSongFirst(bot, message, Song, function (err) {
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
                bot.reply(message, 'This Command does not work in private Channels');
            }
            return;
        case "!w.rqueue":
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
                voice.setVolume(bot, message, function (err, response) {
                    if (err) return bot.reply(message, err);
                    bot.reply(message, response);
                });
            } else {
                bot.reply(message, 'This Command does not work in private Channels');
            }
            return;
        default:
            return;
    }
};
module.exports = musicCommands;