/**
 * Created by julia on 26.06.2016.
 */
var yt = require('../../youtube/youtube');
var songModel = require('../../../DB/song');
var queueModel = require('../../../DB/queue');
var Discord = require("discord.js");
var path = require('path');
var getOsu = require('./osu');
var voice = require('../../utility/voice');
var musicCommands = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.yt":
            if (typeof (messageSplit[1]) !== 'undefined') {
                bot.reply(message, 'Started Downloading Video');
                yt(messageSplit[1], message, function (err, info) {
                    if (err) {
                        console.log(err);
                        return bot.reply(message, 'This is not a Valid Url!');
                    }
                    bot.reply(message, 'Finished Downloading ' + info.title);
                });
            } else {
                bot.reply(message, "No YT Link found!");
            }
            return;
        case "!w.play":
            if (!message.channel.isPrivate) {
                if (typeof (messageSplit[1]) !== 'undefined') {
                    var messageSearch = "";
                    for (var i = 1; i < messageSplit.length; i++) {
                        messageSearch = messageSearch + " " + messageSplit[i]
                    }
                    songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec(function (err, Songs) {
                        if (err) return console.log(err);
                        var Song = Songs[0];
                        if (Song) {
                            console.log(voice.inVoice(bot, message));
                            if (voice.inVoice(bot, message)) {
                                var connection = voice.getVoiceConnection(bot, message);
                                if (!connection.playing) {
                                    try {
                                        connection.resume();
                                    } catch (e) {

                                    }
                                }
                                voice.addSongFirst(bot, message, Song, function (err) {
                                    if (err) return console.log(err);
                                    connection.playFile(path.resolve(Song.path)).then(function (intent) {
                                        bot.reply(message, "Now playing Song: " + Song.title);
                                        intent.on("end", function () {
                                            console.log("File ended!");
                                            voice.nextSong(bot, message, Song);
                                        });
                                        intent.on("error", function (err) {
                                            console.log(err);
                                        });
                                    }).catch(function (err) {
                                        console.log(err);
                                    });
                                })
                            } else {
                                bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                            }
                        } else {
                            bot.reply(message, "No Song found with Name <" + messageSplit[1] + "> trying to download it.");
                            yt(messageSplit[1], message, function (err, info) {
                                if (err) {
                                    console.log(err);
                                    return bot.reply(message, "No Song found with Name " + messageSplit[1]);
                                }
                                bot.reply(message, 'Found Song and Downloaded it! ' + info.title);
                                songModel.findOne({id: info.id}, function (err, Song) {
                                    if (err) return console.log(err);
                                    if (Song) {
                                        if (voice.inVoice(bot, message)) {
                                            var connection = voice.getVoiceConnection(bot, message);
                                            if (!connection.playing) {
                                                try {
                                                    connection.resume();
                                                } catch (e) {
                                                }
                                            }
                                            voice.addSongFirst(bot, message, Song, function (err) {
                                                if (err) return console.log(err);
                                                connection.playFile(path.resolve(Song.path)).then(function (intent) {
                                                    bot.reply(message, "Now playing Song: " + Song.title);
                                                    intent.on("end", function () {
                                                        console.log("File ended!");
                                                        voice.nextSong(bot, message, Song);
                                                    });
                                                    intent.on("error", function (err) {
                                                        console.log(err);
                                                    });
                                                }).catch(function (err) {
                                                    console.log(err);
                                                });
                                            });
                                        } else
                                            bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                                    } else {
                                        bot.reply(message, 'Seems like a Error happened...');
                                    }
                                });
                            });
                        }
                    });
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
                        bot.reply(message, "No Songs found with Search Term " + messageSearch);
                    }
                });
            } else {
                bot.reply(message, "No Search Term entered!");
            }
            return;
        case "!w.queue":
            var connection = voice.getVoiceConnection(bot, message);
            if (typeof (messageSplit[1]) !== 'undefined') {
                var messageSearch = "";
                for (var a = 1; a < messageSplit.length; a++) {
                    messageSearch = messageSearch + " " + messageSplit[a]
                }
                songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec(function (err, Songs) {
                    if (err) return console.log(err);
                    if (Songs !== null && Songs.length > 0) {
                        queueModel.findOne({server: message.server.id}, function (err, Queue) {
                            if (err) return console.log(err);
                            if (Queue) {
                                if (Queue.songs.length === 0) {
                                    if (connection) {
                                        connection.playFile(path.resolve(Songs[0].path)).then(function (intent) {
                                            bot.reply(message, "Now playing Song: " + Queue.songs[0].title);
                                            intent.on("end", function () {
                                                console.log("File ended!");
                                                voice.nextSong(bot, message, Queue.songs[0]);
                                            });
                                            intent.on("error", function (err) {
                                                console.log(err);
                                            });
                                        }).catch(function (err) {
                                            console.log(err);
                                        });
                                    }
                                }
                                queueModel.update({_id: Queue._id}, {$addToSet: {songs: Songs[0]}}, function (err) {
                                    if (err) return console.log(err);
                                    bot.reply(message, "Successfully added " + Songs[0].title + " to the Queue!");
                                });
                            } else {
                                var queue = new queueModel({
                                    server: message.server.id,
                                    songs: [Songs[0]]
                                });
                                queue.save(function (err) {
                                    if (err) return console.log(err);
                                    bot.reply(message, "Successfully added " + Songs[0].title + " to the Queue!");
                                    if (connection) {
                                        connection.playFile(path.resolve(Songs[0].path)).then(function (intent) {
                                            bot.reply(message, "Now playing Song: " + Queue.songs[0].title);
                                            intent.on("end", function () {
                                                console.log("File ended!");
                                                voice.nextSong(bot, message, Queue.songs[0]);
                                            });
                                            intent.on("error", function (err) {
                                                console.log(err);
                                            });
                                        }).catch(function (err) {
                                            console.log(err);
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        bot.reply(message, 'No Song found with Search Term ' + messageSearch);
                    }
                });
            } else {
                queueModel.findOne({server: message.server.id}, function (err, Queue) {
                    if (err) return console.log(err);
                    if (Queue) {
                        if (Queue.songs.length > 0) {
                            var reply = "The Following Songs are in the Queue right now:\n\n";
                            for (var q = 0; q < Queue.songs.length; q++) {
                                if (q === 0) {
                                    reply = reply + "Now Playing: ```" + Queue.songs[q].title + "```\n\n";
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
        default:
            return;
    }
};
module.exports = musicCommands;