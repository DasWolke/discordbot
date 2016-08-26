/**
 * Created by julia on 10.07.2016.
 */
var Discord = require('discord.js');
var queueModel = require('../../DB/queue');
var songModel = require('../../DB/song');
var serverModel = require('../../DB/server');
var path = require('path');
var songDuration = 0;
var general = require('./general');
var saveVoiceChannel = function saveVoiceChannel(channel, cb) {
    serverModel.findOne({id: channel.server.id}, function (err, Server) {
        if (err) {
            console.log('error!!!');
            return cb(err);
        }
        if (Server) {
            Server.updateVoice(channel.id, function (err) {
                if (err) {
                    console.log('Error at update Voice!');
                    return console.log(err);
                }
            });
        } else {
            var server = new serverModel({
                id: channel.server.id,
                lastVoiceChannel: channel.id,
                permissions: [],
                disabledCmds: [],
                Groups: [],
                Blacklist: [],
                prefix: "!w"
            });
            server.save(cb);
        }
    });
};
var clearLastVoice = function clearLastVoice(message, cb) {
    serverModel.findOne({id: message.server.id}, function (err, Server) {
        if (err) {
            console.log('error!!!');
            return cb(err);
        }
        console.log('Called Clear Voice!');
        if (Server) {
            Server.updateVoice("", function (err) {
                if (err) {
                    console.log('Error at update Voice!');
                    return cb(err);
                }
                cb();
            });
        } else {
            var server = new serverModel({
                id: message.server.id,
                lastVoiceChannel: "",
                permissions: [],
                disabledCmds: [],
                Groups: [],
                Blacklist: [],
                prefix: "!w"
            });
            server.save(cb);
        }
    });
};
var loadLastVoice = function loadLastVoice(server, cb) {
    if (typeof(server) !== 'undefined' && typeof(server.id) !== 'undefined' && server) {
        serverModel.findOne({id: server.id}, function (err, Server) {
            if (err) return cb(err);
            if (Server) {
                if (typeof(Server.lastVoiceChannel) !== 'undefined' && Server.lastVoiceChannel !== '') {
                    cb(null, Server.lastVoiceChannel);
                } else {
                    cb(null);
                }
            } else {
                if (typeof(server) !== 'undefined' && typeof(server.id) !== 'undefined' && server) {
                    var server = new serverModel({
                        id: server.id,
                        lastVoiceChannel: "",
                        permissions: [],
                        disabledCmds: [],
                        Groups: [],
                        Blacklist: [],
                        prefix: "!w"
                    });
                    server.save(cb);
                } else {
                    cb();
                }
            }
        });
    } else {
        cb();
    }
};
var joinVoiceChannel = function joinVoiceChannel(bot, channel, cb) {
    bot.joinVoiceChannel(channel, function (err, connection) {
        if (!err) {

        } else {
            console.log(err);
            cb('An Error has occured while trying to join Voice!');
        }
    });
};
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
var getVoiceConnectionServer = function getVoiceConnectionServer(bot, server) {
    for (var connectionA of bot.internal.voiceConnections) {
        for (var channel of server.channels) {
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
var getChannelFromId = function getChannelFromId(server, id) {
    for (var channel of server.channels) {
        if (channel.id === id) {
            return channel;
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
                    if (typeof (Queue.repeat) !== 'undefined' && typeof (Queue.repeatId) !== 'undefined' && Queue.repeat && Song.id === Queue.repeatId) {
                        playSong(bot, message, Song, true);
                    } else if (typeof (Queue.repeat) !== 'undefined' && typeof (Queue.repeatId) !== 'undefined' && Queue.repeat === false) {
                        {
                            Queue.stopRepeat(function (err) {
                                if (err) return console.log(err);
                                if (Queue.songs[0].id === Song.id) {
                                    queueModel.update({_id: Queue._id}, {$pop: {songs: -1}}, function (err) {
                                        if (err) return console.log(err);
                                        queueModel.findOne({_id: Queue._id}, function (err, Queue) {
                                            if (err) return console.log(err);
                                            if (Queue.songs.length > 0) {
                                                Queue.resetVotes(function (err) {
                                                    if (err) return console.log(err);
                                                    playSong(bot, message, Queue.songs[0], true);
                                                });
                                            } else {
                                                Queue.resetVotes();
                                                connectionE.stopPlaying();
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    } else {
                        if (Queue.songs[0].id === Song.id) {
                            queueModel.update({_id: Queue._id}, {$pop: {songs: -1}}, function (err) {
                                if (err) return console.log(err);
                                queueModel.findOne({_id: Queue._id}, function (err, Queue) {
                                    if (err) return console.log(err);
                                    if (Queue.songs.length > 0) {
                                        Queue.resetVotes(function (err) {
                                            if (err) return console.log(err);
                                            playSong(bot, message, Queue.songs[0], true);
                                        });
                                    } else {
                                        Queue.resetVotes();
                                        connectionE.stopPlaying();
                                    }
                                });
                            });
                        }
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
var addSongFirst = function addSongFirst(bot, message, Song, repeat, cb) {
    queueModel.findOne({server: message.server.id}, function (err, Queue) {
        if (err) return cb(err);
        var Songs = [];
        Song.user = {};
        Song.user.id = message.author.id;
        Song.user.name = message.author.username;
        Songs.push(Song);
        if (Queue) {
            if (repeat) {
                Queue.startRepeat(function (err) {
                    if (err) return console.log(err);
                });
                Queue.updateRepeatId(Song.id, function (err) {
                    if (err) return console.log(err);
                });
            } else {
                Queue.stopRepeat(function (err) {
                    if (err) return console.log(err);
                });
                Queue.updateRepeatId("", function (err) {
                    if (err) return console.log(err);
                });
            }
            if (Queue.songs.length !== 0) {
                //i hate this stuff
                queueModel.update({_id: Queue._id}, {$pull: {songs: {id: Song.id}}}, function (err) {
                    if (err) return cb(err);
                    queueModel.update({_id: Queue._id}, {$push: {songs: {$each: Songs, $position: 0}}}, function (err) {
                        if (err) return cb(err);
                        cb(null);
                    });
                });
            } else {
                queueModel.update({_id: Queue._id}, {$push: {songs: {$each: Songs, $position: 0}}}, function (err) {
                    if (err) return cb(err);
                    cb(null);
                });
            }
        } else {
            if (typeof(repeat) !== 'undefined') {
                var queue = new queueModel({
                    server: message.server.id,
                    voteSkip: 0,
                    repeat: true,
                    repeatId: Song.id,
                    songs: Songs
                });
            } else {
                var queue = new queueModel({
                    server: message.server.id,
                    voteSkip: 0,
                    repeat: false,
                    songs: Songs
                });
            }
            queue.save(cb);
        }
    });
};
var playSong = function (bot, message, Song, Queueused) {
    var connection = getVoiceConnection(bot, message);
    if (!connection.playing) {
        try {
            connection.resume();
        } catch (e) {

        }
    }
    connection.stopPlaying();
    connection.playFile(path.resolve(Song.path), {volume: 0.25}).then(function (intent) {
        updatePlays(Song.id, function (err) {
            if (err) return console.log(err);
        });
        if (typeof(Queueused) === 'undefined') {
            bot.sendMessage(message.channel, "Now playing Song: " + Song.title);
        }
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
            Queue.stopRepeat(function (err) {
                if (err) return console.log(err);
                if (Queue.songs.length > 0) {
                    Queue.resetVotes(function (err) {
                        if (err) return console.log(err);
                        playSong(bot, message, Queue.songs[0], true);
                    });
                } else {

                }
            });
        }
    });
};
var autoStartQueue = function (bot, message) {
    queueModel.findOne({server: message.server.id}, function (err, Queue) {
        if (err) return console.log(err);
        if (Queue) {
            Queue.stopRepeat(function (err) {
                if (err) return console.log(err);
                if (Queue.songs.length > 0) {
                    Queue.resetVotes(function (err) {
                        if (err) return console.log(err);
                        playSong(bot, message, Queue.songs[0], true);
                    });
                } else {

                }
            });
        }
    });
};
var addToQueue = function (bot, message, Song) {
    queueModel.findOne({server: message.server.id}, function (err, Queue) {
        if (err) return console.log(err);
        var connection = getVoiceConnection(bot, message);
        Song.user = {};
        Song.user.id = message.author.id;
        Song.user.name = message.author.username;
        if (Queue) {
            Queue.stopRepeat(function (err) {
                if (err) return console.log(err);
                if (Queue.songs.length === 0) {
                    if (connection) {
                        playSong(bot, message, Song);
                    }
                }
                for (var i = 0; i < Queue.songs.length; i++) {
                    if (Queue.songs[i].id === Song.id) {
                        return bot.reply(message, Song.title + " is already in the Queue!");
                    }
                }
                queueModel.update({_id: Queue._id}, {$addToSet: {songs: Song}}, function (err) {
                    if (err) return console.log(err);
                    bot.reply(message, "Successfully added " + Song.title + " to the Queue!");
                });
            });
        } else {
            var queue = new queueModel({
                server: message.server.id,
                songs: [Song],
                repeat: false,
                repeatId: ""
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
var nowPlaying = function (bot, message) {
    queueModel.findOne({server: message.server.id}, function (err, Queue) {
        if (err) return console.log(err);
        if (Queue) {
            if (Queue.songs.length === 0) {
                bot.reply(message, 'Nothing is playing right now...');
            } else {
                if (inVoiceChannel(bot, message)) {
                    bot.reply(message, 'Currently Playing: ```' + Queue.songs[0].title + " " + general.convertSeconds(getDuration()) + "```");
                } else {
                    bot.reply(message, 'Nothing is playing right now...');
                }
            }
        } else {
            var queue = new queueModel({
                server: message.server.id,
                songs: []
            });
            queue.save(function (err) {
                if (err) return console.log(err);
                bot.reply(message, 'Nothing is playing right now...');
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
            cb(null, 'Set Volume to ' + volume * 100);
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
var checkMedia = function checkMedia(link) {
    var SoundcloudReg = /(?:http?s?:\/\/)?(?:www\.)?(?:soundcloud\.com|snd\.sc)\/(?:.*)/g;
    var YoutubeReg = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)(&.*|)/g;
    if (YoutubeReg.test(link)) {
        return true;
    } else if (SoundcloudReg.test(link)) {
        return true;
    } else {
        return false;
    }
};
module.exports = {
    inVoice: inVoiceChannel,
    saveVoice: saveVoiceChannel,
    loadVoice: loadLastVoice,
    clearVoice: clearLastVoice,
    joinVoice: joinVoiceChannel,
    nextSong: nextSong,
    playSong: playSong,
    now: nowPlaying,
    getVoiceConnection: getVoiceConnection,
    getVoiceConnectionByServer: getVoiceConnectionServer,
    getVoiceChannel: getVoiceChannel,
    getChannelById: getChannelFromId,
    addSongFirst: addSongFirst,
    startQueue: startQueue,
    autoStartQueue: autoStartQueue,
    addToQueue: addToQueue,
    getSongDuration: getDuration,
    updatePlays: updatePlays,
    setVolume: setVolume,
    checkMedia: checkMedia
};