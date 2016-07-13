/**
 * Created by julia on 10.07.2016.
 */
var Discord = require('discord.js');
var queueModel = require('../../DB/queue');
var path = require('path');
var inVoiceChannel = function inVoiceChannel(bot, message) {
    for (var connectionC of bot.internal.voiceConnections) {
        for (var channel of message.server.channels) {
            if (channel instanceof Discord.VoiceChannel) {
                if (connectionC.voiceChannel.equals(channel)) {
                    return true;
                }
            }
        }
    }
    return false;
};
var getVoiceConnection = function getVoiceConnection(bot, message) {
    for (var connectionA of bot.internal.voiceConnections) {
        for (var channel of message.server.channels) {
            if (channel instanceof Discord.VoiceChannel) {
                if (connectionA.voiceChannel.equals(channel)) {
                    return connectionA;
                }
            }
        }
    }
    return null;
};
var getVoiceChannel = function getVoiceChannel(bot, message) {
    for (var connection of bot.internal.voiceConnections) {
        for (var channel of message.server.channels) {
            if (channel instanceof Discord.VoiceChannel) {
                if (connection.voiceChannel.equals(channel)) {
                    return channel;
                }
            }
        }
    }
    return null;
};
var nextSong = function nextSong(bot, message, Song) {
    if (inVoiceChannel(bot, message)) {
        var connectionE = getVoiceConnection(bot, message);
        queueModel.findOne({server: message.server.id}, function (err, Queue) {
            if (err) return console.log(err);
            if (Queue) {
                if (Queue.songs.length > 0) {
                    if (Queue.songs[0].id === Song.id) {
                        queueModel.update({_id: Queue._id}, {$pop: {songs: -1}}, function (err) {
                            if (err) return console.log(err);
                            queueModel.findOne({_id: Queue._id}, function (err, Queue) {
                                if (err) return console.log(err);
                                if (Queue.songs.length > 0) {
                                    connectionE.playFile(path.resolve(Queue.songs[0].path)).then(function (intent) {
                                        bot.sendMessage(message.channel, "Now playing Song: " + Queue.songs[0].title);
                                        intent.on("end", function () {
                                            console.log("File ended!");
                                            nextSong(bot, message, Queue.songs[0]);
                                        });
                                        intent.on("error", function (err) {
                                            console.log(err);
                                        });
                                    }).catch(function (err) {
                                        console.log(err);
                                    });
                                } else {
                                    connectionE.stopPlaying();
                                }
                            });
                        });
                    }
                } else {
                    connectionE.stopPlaying();
                }
            } else {
                return;
            }
        });
    }
};
var addSongFirst = function addSongFirst(bot, message, Song, cb) {
    queueModel.findOne({server: message.server.id}, function (err, Queue) {
        if (err) return cb(err);
        var Songs = [];
        Songs.push(Song);
        if (Queue) {
            if (Queue.songs.length !== 0) {
                //i hate this stuff
                queueModel.update({_id: Queue._id}, {$pull: {songs: Song}}, function (err) {
                    if (err) return cb(err);
                    queueModel.update({_id: Queue._id}, {$push: {songs: {$each: Songs, $position: 0}}}, function (err) {
                        if (err) return cb(err);
                        cb();
                    });
                });
            } else {
                queueModel.update({_id: Queue._id}, {$push: {songs: {$each: Songs, $position: 0}}}, function (err) {
                    if (err) return cb(err);
                    cb();
                });
            }
        } else {
            var queue = new queueModel({
                server: message.server.id,
                songs: Songs
            });
            queue.save(function (err) {
                if (err) return cb(err);
                cb();
            });
        }
    });
};
module.exports = {
    inVoice: inVoiceChannel,
    nextSong: nextSong,
    getVoiceConnection: getVoiceConnection,
    getVoiceChannel: getVoiceChannel,
    addSongFirst: addSongFirst
};