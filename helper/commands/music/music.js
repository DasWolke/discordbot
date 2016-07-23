/**
 * Created by julia on 26.06.2016.
 */
var yt = require('../../youtube/youtube');
var songHelper = require('../../utility/music/songs');
var songModel = require('../../../DB/song');
var queueModel = require('../../../DB/queue');
var path = require('path');
var getOsu = require('./osu');
var voice = require('../../utility/voice');
var general = require('../../utility/general');
var ytHelper = require('../../youtube/helper');
var messageHelper = require('../../utility/message');
var YoutubeReg = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)(&.*|)/g;
var musicCommands = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.yt":
            if (typeof (messageSplit[1]) !== 'undefined') {
                bot.reply(message, 'Started Downloading Video');
                yt.download(messageSplit[1], message, function (err, info) {
                    if (err) {
                        console.log(err);
                        return bot.reply(message, 'This is not a Valid Url, maybe the Song is too long or is blocked!');
                    }
                    bot.reply(message, 'Finished Downloading ' + info.title);
                });
            } else {
                bot.reply(message, "No YT Link found!");
            }
            return;
        case "!w.yts":
            yt.search(message, function (err, Result) {
                if (err) {
                    bot.reply(message, err);
                } else {
                    bot.reply(message, 'Found the Following Song ' + Result.link);
                }
            });
            return;
        case "!w.play":
            if (!message.channel.isPrivate) {
                if (typeof (messageSplit[1]) !== 'undefined') {
                    var messageSearch = "";
                    for (var i = 1; i < messageSplit.length; i++) {
                        messageSearch = messageSearch + " " + messageSplit[i]
                    }
                    if (YoutubeReg.test(messageSearch)) {
                        ytHelper.ytDlAndPlayFirst(bot, message, messageSearch, messageSplit);
                    } else {
                        songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec(function (err, Songs) {
                            if (err) return console.log(err);
                            var Song = Songs[0];
                            if (Song) {
                                console.log(voice.inVoice(bot, message));
                                if (voice.inVoice(bot, message)) {
                                    voice.addSongFirst(bot, message, Song, function (err) {
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
                bot.reply(message, "This Commands Only Works in Server Channels!");
            }
            return;
        case "!w.osu":
            getOsu(bot, message, messageSplit[1]);
            return;
        case "!w.pause":
            if (!message.channel.isPrivate) {
                var admin = false;
                for (var role of message.server.rolesOfUser(message.author)) {
                    if (role.name === 'WolkeBot') {
                        admin = true;
                    }
                }
                if (message.server.id === '118689714319392769' && admin || message.server.id !== '118689714319392769') {
                    if (voice.inVoice(bot, message)) {
                        var connection = voice.getVoiceConnection(bot, message);
                        if (!connection.playing) {
                            return bot.reply(message, "No Song is playing at the Moment");
                        }
                        try {
                            connection.pause();
                        } catch (e) {
                            bot.reply(message, "No Song playing at the Moment!");
                        }
                    }
                    else {
                        bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                    }
                }
                else {
                    bot.reply(message, 'No Permission!');
                }
            }
            else {
                bot.reply(message, "This Commands Only Works in Server Channels!");
            }
            return;
        case "!w.resume":
            if (!message.channel.isPrivate) {
                var admin = false;
                for (var role of message.server.rolesOfUser(message.author)) {
                    if (role.name === 'WolkeBot') {
                        admin = true;
                    }
                }
                if (message.server.id === '118689714319392769' && admin || message.server.id !== '118689714319392769') {
                    if (voice.inVoice(bot, message)) {
                        var connection = voice.getVoiceConnection(bot, message);
                        found = true;
                        if (connection.playing) {
                            return bot.reply(message, "A Song is playing at the Moment!");
                        }
                        try {
                            connection.resume();
                        } catch (e) {
                            bot.reply(message, "No Song playing at the Moment!");
                        }
                    }
                    else {
                        bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                    }
                } else {
                    bot.reply(message, 'No Permission!');
                }
            } else {
                bot.reply(message, "This Commands Only Works in Server Channels!");
            }
            return;
        case"!w.search":
            if (typeof (messageSplit[1]) !== 'undefined') {
                var messageSearch = "";
                for (var c = 1; c < messageSplit.length; c++) {
                    messageSearch = messageSearch + " " + messageSplit[c]
                }
                songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(5).exec(function (err, Songs) {
                    if (err) return console.log(err);
                    if (Songs !== null && Songs.length > 0) {
                        var reply = "Found the following Songs:\n\n";
                        for (var x = 0; x < Songs.length; x++) {
                            reply = reply + parseInt(x + 1) + ": ```" + Songs[x].title + "```\n\n";
                        }
                        bot.reply(message, reply);
                    } else {
                        bot.reply(message, "No Songs found with Search Term " + messageHelper.cleanMessage(messageSearch));
                    }
                });
            } else {
                bot.reply(message, "No Search Term entered!");
            }
            return;
        case "!w.queue":
            if (typeof (messageSplit[1]) !== 'undefined') {
                var messageSearch = "";
                for (var a = 1; a < messageSplit.length; a++) {
                    messageSearch = messageSearch + " " + messageSplit[a]
                }
                console.log(messageSplit[1]);
                if (messageSplit[1].match(YoutubeReg)) {
                    ytHelper.ytDlAndQueue(bot, message, messageSearch, messageSplit);
                } else {
                    songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec(function (err, Songs) {
                        if (err) return console.log(err);
                        if (Songs !== null && Songs.length > 0) {
                            voice.addToQueue(bot, message, Songs[0]);
                        } else {
                            bot.reply(message, 'No Song found with Search Term `' + messageHelper.cleanMessage(messageSearch) + '`');
                        }
                    });
                }
            } else {
                queueModel.findOne({server: message.server.id}, function (err, Queue) {
                    if (err) return console.log(err);
                    if (Queue) {
                        if (Queue.songs.length > 0) {
                            var reply = "The Following Songs are in the Queue right now:\n\n";
                            for (var q = 0; q < Queue.songs.length; q++) {
                                if (q === 0) {
                                    reply = reply + "Now Playing: ```" + Queue.songs[q].title + " Time:" + general.convertSeconds(voice.getSongDuration()) + "```\n\n";
                                } else {
                                    reply = reply + parseInt(q + 1) + ": ```" + Queue.songs[q].title + "```\n\n";
                                }
                            }
                            bot.reply(message, reply);
                        } else {
                            bot.reply(message, 'There is no Song in the Queue right now!');
                        }
                    } else {
                        bot.reply(message, 'There is no Song in the Queue right now!');
                    }
                });
            }
            return;
        case "!w.skip":
            if (voice.inVoice(bot, message)) {
                var admin = false;
                for (var role of message.server.rolesOfUser(message.author)) {
                    if (role.name === 'WolkeBot') {
                        admin = true;
                    }
                }
                if (message.server.id === '118689714319392769' && admin || message.server.id !== '118689714319392769') {
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
            return;
        case "!w.rqueue":
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
            return;
        case "!w.voteskip":
            songHelper.voteSkip(bot, message, function (err, response) {
                if (err) {
                    return bot.reply(message, err);
                }
                bot.reply(message, response);
            });
            return;
        default:
            return;
    }
};
module.exports = musicCommands;