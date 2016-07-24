/**
 * Created by julia on 10.07.2016.
 */
var Discord = require('discord.js');
var queueModel = require('../../DB/queue');
var songModel = require('../../DB/song');
var path = require('path');
var songDuration = 0;
var general = require('./general');
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
                                    Queue.resetVotes(function (err) {
                                        if (err) return console.log(err);
                                        playSong(bot, message, Queue.songs[0]);
                                    });
                                } else {
                                    Queue.resetVotes();
                                    connectionE.stopPlaying();
                                }
                            });
                        });
                    }
                } else {
                    Queue.resetVotes();
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
var playSong = function (bot, message, Song) {
    var connection = getVoiceConnection(bot, message);
    if (!connection.playing) {
        try {
            connection.resume();
        } catch (e) {

        }
    }
    connection.playFile(path.resolve(Song.path)).then(function (intent) {
        updatePlays(Song.id, function (err) {
            if (err) return console.log(err);
        });
        bot.sendMessage(message.channel, "Now playing Song: " + Song.title);
        var timer = setInterval(function () {
            setDuration(getDuration() + 1);
        }, 1000);
        intent.on("end", function () {
            clearInterval(timer);
            setDuration(0);
            console.log("File ended!");
            nextSong(bot, message, Song);
        });
        intent.on("error", function (err) {
            console.log(err);
        });
    }).catch(function (err) {
        console.log(err);
    });
};
var startQueue = function (bot, message) {
    queueModel.findOne({server: message.server.id}, function (err, Queue) {
        if (err) return console.log(err);
        if (Queue) {
            if (Queue.songs.length > 0) {
                Queue.resetVotes(function (err) {
                    if (err) return console.log(err);
                    playSong(bot, message, Queue.songs[0]);
                });
            } else {

            }
        }
    });
};
var addToQueue = function (bot, message, Song) {
    queueModel.findOne({server: message.server.id}, function (err, Queue) {
        if (err) return console.log(err);
        var connection = getVoiceConnection(bot, message);
        var channel = getVoiceChannel(bot,message);
        if (Queue) {
            if (Queue.songs.length === 0) {
                if (connection) {
                    playSong(bot, message, Song);
                }
            }
            for (var i = 0; i < Queue.songs.length; i++) {
                if (Queue.songs[i].id === Song.id){
                    return bot.reply(message, Song.title + "is already in the Queue!");
                }
            }
            queueModel.update({_id: Queue._id}, {$addToSet: {songs: Song}}, function (err) {
                if (err) return console.log(err);
                bot.reply(message, "Successfully added " + Song.title + " to the Queue!");
            });
        } else {
            var queue = new queueModel({
                server: message.server.id,
                songs: [Song]
            });
            queue.save(function (err) {
                if (err) return console.log(err);
                bot.reply(message, "Successfully added " + Song.title + " to the Queue!");
                if (connection) {
                    playSong(bot, message, Song);
                }
            });
        }
    });
};
var setVolume = function (bot, message, cb) {
    var messageSplit = message.content.split(' ');
    if (inVoiceChannel(bot, message)) {
        var connection = getVoiceConnection(bot, message);
        if (typeof (messageSplit[1]) !== 'undefined') {
            try {
                var volume = parseInt(messageSplit[1]) / 100;
            } catch (e) {
                return cb('Please input a Number!');
            }
            try {
                connection.setVolume(volume);
            } catch (e) {
                return cb('Error while setting Volume!');
            }
            cb(null, 'Set Volume to ' + volume*100);
        } else {
            return cb('No Volume set!');
        }
    } else {
        return cb('No Voice Connection on this Server at the Moment.');
    }
};
var setDuration = function (second) {
    songDuration = second;
};
var getDuration = function () {
    return songDuration;
};
var updatePlays = function updatePlays(id, cb) {
    songModel.update({id: id}, {$inc: {plays: 1}}, cb);
};
module.exports = {
    inVoice: inVoiceChannel,
    nextSong: nextSong,
    playSong: playSong,
    getVoiceConnection: getVoiceConnection,
    getVoiceChannel: getVoiceChannel,
    addSongFirst: addSongFirst,
    startQueue: startQueue,
    addToQueue: addToQueue,
    getSongDuration: getDuration,
    updatePlays: updatePlays,
    setVolume:setVolume
};