/**
 * Created by julia on 10.07.2016.
 */
var i18nBean = require('./i18nManager');
var t = i18nBean.getT();
var fs = require('fs');
var ytdl = require('ytdl-core');
var queueModel = require('../DB/queue');
var songModel = require('../DB/song');
var serverModel = require('../DB/server');
var path = require('path');
var general = require('./general');
var request = require('request');
var dispatcherArray = [];
var errorReporter = require('./errorReporter');
var client = errorReporter.getT();
var shortid = require('shortid');
var async = require('async');
var logger = require('./logger');
var icy = require("icy");
var child_process = require("child_process");
var winston = logger.getT();
var _ = require('lodash');
var musicHelper = require("./music.js");
var beta = require('../config/main.json').beta;
var url;
if (beta) {
    url = 'http://localhost:7011/s/'
} else {
    url = 'http://localhost:7010/s/'
}
var saveVoiceChannel = function saveVoiceChannel(channel) {
    return new Promise((resolve, reject) => {
        serverModel.findOne({id: channel.guild.id}, function (err, Server) {
            if (err) {
                reject('err in db');
            }
            if (Server) {
                Server.updateVoice(channel.id, function (err) {
                    if (err) {
                        reject('Internal Error');
                    }
                    resolve();
                });
            } else {
                var server = new serverModel({
                    id: channel.guild.id,
                    lastVoiceChannel: channel.id,
                    nsfwChannels: [],
                    cmdChannels: [],
                    permissions: [],
                    prefix: "!w.",
                    disabledCmds: [],
                    Groups: [],
                    Blacklist: []
                });
                server.save(err => {
                    if (err) reject('Internal Error');
                    resolve();
                });
            }
        });
    });
};
var clearLastVoice = function clearLastVoice(message) {
    return new Promise((resolve, reject) => {
        serverModel.findOne({id: message.guild.id}, function (err, Server) {
            if (err) {
                reject('Internal Error');
            }
            if (Server) {
                Server.updateVoice("", function (err) {
                    if (err) {
                        reject('Internal Error');
                    }
                    resolve();
                });
            } else {
                var server = new serverModel({
                    id: message.guild.id,
                    lastVoiceChannel: "",
                    nsfwChannels: [],
                    cmdChannels: [],
                    permissions: [],
                    prefix: "!w.",
                    disabledCmds: [],
                    Groups: [],
                    Blacklist: []
                });
                server.save(err => {
                    if (err) reject('Internal Error');
                    resolve();
                });
            }
        });
    });
};
var loadLastVoice = function loadLastVoice(guild) {
    return new Promise((resolve, reject) => {
        if (typeof(guild) !== 'undefined' && typeof(guild.id) !== 'undefined' && guild) {
            serverModel.findOne({id: guild.id}, function (err, Server) {
                if (err) reject(err);
                if (Server) {
                    if (typeof(Server.lastVoiceChannel) !== 'undefined' && Server.lastVoiceChannel !== '') {
                        resolve(Server.lastVoiceChannel);
                    } else {
                        resolve();
                    }
                } else {
                    if (typeof(guild) !== 'undefined' && typeof(guild.id) !== 'undefined' && guild) {
                        var server = new serverModel({
                            id: guild.id,
                            lastVoiceChannel: "",
                            nsfwChannels: [],
                            cmdChannels: [],
                            permissions: [],
                            prefix: "!w.",
                            disabledCmds: [],
                            Groups: [],
                            Blacklist: []
                        });
                        server.save(err => {
                            if (err) reject('Internal Error');
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                }
            });
        } else {
            resolve();
        }
    });
};
var joinVoiceChannel = function joinVoiceChannel(channel) {
    return new Promise((resolve, reject) => {
        channel.join().then(resolve).catch(reject);
    });
};
var inVoiceChannel = function inVoiceChannel(message) {
    return message.guild.voiceConnection;
};
var getVoiceConnection = function getVoiceConnection(message) {
    return message.guild.voiceConnection
};
var getVoiceConnectionServer = function getVoiceConnectionServer(guild) {
    return guild.voiceConnection;
};
var getVoiceChannel = function getVoiceChannel(message) {
    if (message.guild.voiceConnection) {
        var conn = message.guild.voiceConnection;
        return conn.channel;
    }
    return null;
};
var getChannelFromId = function getChannelFromId(guild, id) {
    if (!!guild.channels.get(id)) {
        return guild.channels.get(id);
    }
    return null;
};
var nextSong = function nextSong(message, Song) {
    if (inVoiceChannel(message)) {
        let connectionVoice = getVoiceConnection(message);
        let dispatcher = getDispatcherFromConnection(connectionVoice);
        queueModel.findOne({server: message.guild.id}, function (err, Queue) {
            if (err) return winston.info(err);
            if (Queue) {
                if (Queue.songs.length > 0) {
                    if (typeof (Queue.repeat) !== 'undefined' && typeof (Queue.repeatId) !== 'undefined' && Queue.repeat && Song.id === Queue.repeatId) {
                        playSong(message, Song, true);
                    } else if (typeof (Queue.repeat) !== 'undefined' && typeof (Queue.repeatId) !== 'undefined' && Queue.repeat === false) {
                        {
                            Queue.stopRepeat(function (err) {
                                if (err) return winston.info(err);
                                if (Queue.songs[0].id === Song.id) {
                                    queueModel.update({_id: Queue._id}, {$pop: {songs: -1}}, function (err) {
                                        if (err) return winston.info(err);
                                        queueModel.findOne({_id: Queue._id}, function (err, Queue) {
                                            if (err) return winston.info(err);
                                            if (Queue.songs.length > 0) {
                                                Queue.resetVotes(function (err) {
                                                    if (err) return winston.info(err);
                                                    if (Queue.songs[0].type !== 'radio') {
                                                        try {
                                                            dispatcher.setVolume(0);
                                                        } catch (e) {
                                                            winston.info(e);
                                                        }
                                                        playSong(message, Queue.songs[0], true);
                                                    } else {
                                                        nextSong(message, Queue.songs[0]);
                                                    }
                                                });
                                            } else {
                                                Queue.resetVotes();
                                                try {
                                                    dispatcher.end();
                                                } catch (e) {
                                                    winston.info(e);
                                                }
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    } else {
                        if (Queue.songs[0].id === Song.id) {
                            queueModel.update({_id: Queue._id}, {$pop: {songs: -1}}, function (err) {
                                if (err) return winston.info(err);
                                queueModel.findOne({_id: Queue._id}, function (err, Queue) {
                                    if (err) return winston.info(err);
                                    if (Queue.songs.length > 0) {
                                        Queue.resetVotes(function (err) {
                                            if (err) return winston.info(err);
                                            playSong(message, Queue.songs[0], true);
                                        });
                                    } else {
                                        Queue.resetVotes();
                                        try {
                                            dispatcher.end();
                                        } catch (e) {
                                            winston.info(e);
                                        }
                                    }
                                });
                            });
                        }
                    }
                } else {
                    Queue.resetVotes();
                    try {
                        dispatcher.end();
                    } catch (e) {

                    }
                }
            } else {

            }
        });
    }
};
var addSongFirst = function addSongFirst(message, Song, repeat) {
    return new Promise((resolve, reject) => {
        queueModel.findOne({server: message.guild.id}, function (err, Queue) {
            if (err) return cb(err);
            var Songs = [];
            Song.user = {};
            Song.user.id = message.author.id;
            Song.user.name = message.author.username;
            Songs.push(Song);
            if (Queue) {
                if (typeof(repeat) !== 'undefined' && repeat) {
                    Queue.startRepeat(function (err) {
                        if (err) reject(t('generic.error', {lngs: message.lang}));
                    });
                    Queue.updateRepeatId(Song.id, function (err) {
                        if (err) reject(t('generic.error', {lngs: message.lang}));
                    });
                } else {
                    Queue.stopRepeat(function (err) {
                        if (err) reject(t('generic.error', {lngs: message.lang}));
                    });
                    Queue.updateRepeatId("", function (err) {
                        if (err) reject(t('generic.error', {lngs: message.lang}));
                    });
                }
                if (Queue.songs.length !== 0) {
                    //i hate this stuff
                    queueModel.update({_id: Queue._id}, {$pull: {songs: {id: Song.id}}}, function (err) {
                        if (err) reject(t('generic.error', {lngs: message.lang}));
                        queueModel.update({_id: Queue._id}, {
                            $push: {
                                songs: {
                                    $each: Songs,
                                    $position: 0
                                }
                            }
                        }, function (err) {
                            if (err) reject(t('generic.error', {lngs: message.lang}));
                            resolve();
                        });
                    });
                } else {
                    queueModel.update({_id: Queue._id}, {$push: {songs: {$each: Songs, $position: 0}}}, function (err) {
                        if (err) reject(t('generic.error', {lngs: message.lang}));
                        resolve();
                    });
                }
            } else {
                var queue;
                if (typeof(repeat) !== 'undefined' && repeat) {
                    queue = new queueModel({
                        server: message.guild.id,
                        voteSkip: 0,
                        repeat: true,
                        repeatId: Song.id,
                        songs: Songs
                    });
                } else {
                    queue = new queueModel({
                        server: message.guild.id,
                        voteSkip: 0,
                        repeat: false,
                        songs: Songs
                    });
                }
                queue.save(err => {
                    if (err) reject(t('generic.error', {lngs: message.lang}));
                    resolve();
                });
            }
        });
    });
};
var updateDispatcherArray = function (guild_id, dispatcher) {
    var i = dispatcherArray.length;
    while (i--) {
        if (dispatcherArray[i].guild_id === guild_id) {
            dispatcherArray[i].dispatcher = dispatcher;
            return;
        }
    }
    dispatcherArray.push({guild_id: guild_id, dispatcher: dispatcher})
};
var playSong = function (message, Song, Queueused) {
    var connection = message.guild.voiceConnection;
    if (connection) {
        // let opts = {stdio: [process.stdin, process.stdout, process.stderr, 'pipe', 'ipc']};
        // let child = child_process.fork('./utility/voice/open.js', opts);
        // child.send({path: Song.path});
        //child.stdio[3]
        // let stream = request(`${url}${Song.id}`);
        let stream;
        if (musicHelper.ytRegex.test(Song.url)) {
            var options = {
                filter: (format) => format.container === 'mp4' && format.audioEncoding || format.container === 'webm' && format.audioEncoding,
                quality: ['140', '141', '139', 'lowest'],
                audioonly: true
            };
            stream = ytdl(Song.url, options)
        } else {
            stream = request(`${url}${Song.id}`);
        }
        let dispatcher = connection.playStream(stream, {volume: message.dbServer.volume, passes: 3});
        updateDispatcherArray(message.guild.id, dispatcher);
        winston.info(path.resolve(Song.path));
        updatePlays(Song.id).then(() => {

        }).catch(err => {
            client.captureMessage(`Error at Update Plays in Play Song: ${err}`)
        });
        if (typeof(Queueused) === 'undefined') {
            message.channel.sendMessage(t('play.playing', {
                lngs: message.lang,
                song: Song.title,
                interpolation: {escape: false}
            }));
        }
        dispatcher.on("end", function () {
            dispatcher.setVolume(0);
            winston.info("File ended!");
            // child.kill();
            nextSong(message, Song);
        });
        dispatcher.on("debug", information => {
            winston.info(`Debug: ${information}`);
        });
        dispatcher.on("error", function (err) {
            winston.info(`Error: ${err}`);
        });
        // });
        // player.on('error', (e) => {
        //     winston.error(e);
        // })
    } else {
        // client.captureMessage(`No connection found for Guild ${message.guild.name}`, {
        //     extra: {'Guild': message.guild.id},
        //     'voiceConnection': message.guild.voiceConnection
        // });
    }
};
var streamSong = function (message, stream) {
    var connection = getVoiceConnection(message);
    if (connection) {
        stream.on('metadata', function (metadata) {
            var parsed = icy.parse(metadata);
            winston.info(parsed);
            if (typeof(parsed.StreamTitle) !== 'undefined' && parsed.StreamTitle) {
                setTitle(message, `${parsed.StreamTitle} (${message.songTitle})`);
            }
        });
        let dispatcher = connection.playStream(stream, {volume: message.dbServer.volume});
        updateDispatcherArray(message.guild.id, dispatcher);
        dispatcher.on("end", function () {
            winston.info("Stream ended");
            // nextSong(message, Song);
        });
        dispatcher.on("error", function (err) {
            winston.info(err);
        });
    }
};
var startQueue = function (message) {
    queueModel.findOne({server: message.guild.id}, function (err, Queue) {
        if (err) return winston.info(err);
        if (Queue) {
            Queue.stopRepeat(function (err) {
                if (err) return client.captureMessage(`Error at stop Repeat in start Queue: ${err}`, {extra: {'Guild': message.guild.id}});
                if (Queue.songs.length > 0) {
                    Queue.resetVotes(function (err) {
                        if (err) return client.captureMessage(`Error at reset Votes in start Queue: ${err}`, {extra: {'Guild': message.guild.id}});
                        if (Queue.songs[0].type !== 'radio') {
                            playSong(message, Queue.songs[0], true);
                        } else {
                            nextSong(message, Queue.songs[0]);
                        }
                    });
                } else {

                }
            });
        }
    });
};
var autoStartQueue = function (message) {
    queueModel.findOne({server: message.guild.id}, function (err, Queue) {
        if (err) return winston.info(err);
        if (Queue) {
            Queue.stopRepeat(function (err) {
                if (err) return client.captureMessage(`Error at stopRepeat in autoStartQueue: ${err}`, {extra: {'Guild': message.guild.id}});
                if (Queue.songs.length > 0) {
                    Queue.resetVotes(function (err) {
                        if (err) return client.captureMessage(`Error at resetVotes in autoStartQueue: ${err}`, {extra: {'Guild': message.guild.id}});
                        playSong(message, Queue.songs[0], true);
                    });
                } else {

                }
            });
        }
    });
};
var addToQueue = function (message, Song, reply, cb) {
    if (message.guild.available && message.guild.id) {
        queueModel.findOne({server: message.guild.id}, function (err, Queue) {
            if (err) return cb('Internal Error');
            var connection = getVoiceConnection(message);
            Song.user = {};
            Song.user.id = message.author.id;
            Song.user.name = message.author.username;
            if (Queue) {
                Queue.stopRepeat(function (err) {
                    if (err) return cb(t('generic.error', {lngs: message.lang}));
                    if (Queue.songs.length === 0) {
                        if (connection) {
                            playSong(message, Song);
                        }
                    }
                    async.eachSeries(Queue.songs, (songQ, call) => {
                        if (songQ.id === Song.id) {
                            return call(t('voice.in-queue', {
                                lngs: message.lang,
                                song: Song.title,
                                interpolation: {escape: false}
                            }));
                        } else {
                            async.setImmediate(() => {
                                return call();
                            });
                        }
                    }, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        queueModel.update({_id: Queue._id}, {$addToSet: {songs: Song}}, function (err) {
                            if (err) return cb(t('generic.error', {lngs: message.lang}));
                            if (typeof (reply) === 'undefined' || !reply) {
                                return cb(null, (t('qa.success', {
                                    lngs: message.lang,
                                    song: Song.title,
                                    interpolation: {escape: false}
                                })));
                            } else {
                                return cb(null, "");
                            }
                        });
                    });
                });
            } else {
                var queue = new queueModel({
                    server: message.guild.id,
                    songs: [Song],
                    repeat: false,
                    repeatId: ""
                });
                queue.save((err) => {
                    if (err) return cb(t('generic.error', {lngs: message.lang}));
                    if (connection) {
                        playSong(message, Song);
                    }
                    return cb(null, t('qa.success', {
                        lngs: message.lang,
                        song: Song.title,
                        interpolation: {escape: false}
                    }));
                });
            }
        });
    } else {
        return cb(t('generic.error', {lngs: message.lang}));
    }
};
var addToQueueBatch = function (message, Songs, reply, cb) {
    if (message.guild.available && message.guild.id) {
        queueModel.findOne({server: message.guild.id}, function (err, Queue) {
            if (err) return cb('Internal Error');
            var connection = getVoiceConnection(message);
            for (var i = 0; i < Songs; i++) {
                Songs[i].user = {};
                Songs[i].user.id = message.author.id;
                Songs[i].user.name = message.author.username;
            }
            if (Queue) {
                Queue.stopRepeat(function (err) {
                    if (err) return cb(t('generic.error', {lngs: message.lang}));
                    if (Queue.songs.length === 0) {
                        if (connection) {
                            playSong(message, Songs[0]);
                        }
                    }
                });
                let addSongs = [];
                for (var x = 0; x < Songs.length; x++) {
                    let rip = true;
                    for (var y = 0; y < Queue.songs.length; y++) {
                        if (Songs[x].id === Queue.songs[y].id) {
                            rip = false;
                            break;
                        }
                    }
                    if (rip) {
                        addSongs.push(Songs[x]);
                    }
                }
                queueModel.update({_id: Queue._id}, {$addToSet: {songs: {$each: addSongs}}}, (err, res) => {
                    if (err) return cb(t('generic.error', {lngs: message.lang}), addSongs);
                    winston.info(res);
                    return cb(null, addSongs);
                });
            } else {
                var queue = new queueModel({
                    server: message.guild.id,
                    songs: Songs,
                    repeat: false,
                    repeatId: ""
                });
                queue.save((err) => {
                    if (err) return cb(t('generic.error', {lngs: message.lang}));
                    if (connection) {
                        playSong(message, Songs[0]);
                    }
                    return cb(null, Songs.length);
                });
            }
        });
    } else {
        return cb(t('generic.error', {lngs: message.lang}));
    }
};
var nowPlaying = function (message) {
    return new Promise((resolve, reject) => {
        queueModel.findOne({server: message.guild.id}, function (err, Queue) {
            if (err) reject(err);
            if (Queue) {
                if (Queue.songs.length === 0) {
                    resolve({playing: false, title: ''});
                } else {
                    if (inVoiceChannel(message)) {
                        let dispatcher = getDispatcherFromConnection(message.guild.voiceConnection);
                        let time = Math.floor(dispatcher.time / 1000);
                        if (typeof (Queue.songs[0].duration) !== 'undefined' && Queue.songs[0].duration !== '') {
                            resolve({
                                playing: true,
                                duration: Queue.songs[0].duration,
                                current: general.convertSeconds(time),
                                title: Queue.songs[0].title,
                                repeat: Queue.repeat
                            });
                        } else {
                            resolve({playing: true, title: Queue.songs[0].title, repeat: Queue.repeat});
                        }
                    } else {
                        resolve({playing: false, title: ''});
                    }
                }
            } else {
                var queue = new queueModel({
                    server: message.guild.id,
                    songs: []
                });
                queue.save(function (err) {
                    if (err) reject(err);
                    resolve({playing: false, song: ''});
                });
            }
        });
    });
};
var setVolume = function (message) {
    return new Promise((resolve, reject) => {
        var messageSplit = message.content.split(' ');
        if (inVoiceChannel(message)) {
            var connection = getVoiceConnection(message);
            var dispatcher = getDispatcherFromConnection(connection);
            if (typeof (messageSplit[1]) !== 'undefined') {
                let volume;
                try {
                    volume = parseInt(messageSplit[1]);
                } catch (e) {
                    return message.reply(t('generic.whole-num'));
                }
                if (isNaN(volume)) {
                    return message.reply(t('generic.nan'));
                }
                if (volume < 0) {
                    return message.reply(t('generic.negative', {number: volume}));
                }
                volume = volume / 100;
                try {
                    dispatcher.setVolume(volume);
                    message.dbServer.updateVolume(volume, (err) => {
                        winston.info(err);
                    });
                } catch (e) {
                    winston.info(e);
                    resolve(t('voice.error-volume', {lngs: message.lang}));
                }
                resolve(t('voice.success-volume', {lngs: message.lang, volume: (volume * 100) + '%'}));
            } else {
                resolve(t('voice.no-volume', {lngs: message.lang}));
            }
        } else {
            resolve(t('generic.no-voice', {lngs: message.lang}));
        }
    });
};
var updatePlays = function updatePlays(id, cb) {
    return new Promise((resolve, reject) => {
        songModel.update({id: id}, {$inc: {plays: 1}, $set: {lastPlay: Date.now()}}, err => {
            if (err) reject(err);
            resolve();
        });
    });
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
var getDispatcherFromConnection = function (connection) {
    if (connection) {
        for (var i = 0; i < dispatcherArray.length; i++) {
            if (dispatcherArray[i].guild_id === connection.channel.guild.id) {
                return dispatcherArray[i].dispatcher;
            }
        }
    }
    return false;
};
var queueAddRepeat = function (message, Song) {
    queueModel.findOne({server: message.guild.id}, (err, Queue) => {
        if (err) return winston.info(err);
        if (Queue && Queue.songs.length > 0 && Queue.songs[0].id === Song.id) {
            Queue.startRepeat((err => {
                if (err) return winston.info(err);
                Queue.updateRepeatId(Song.id, err => {
                    if (err) return winston.info(err);
                    message.reply(t('voice.repeat-start', {lngs: message.lang, song: Song.title}));
                });
            }));
        } else {
            addSongFirst(message, Song, true).then(() => {
                let dispatcher;
                if (message.guild.voiceConnection) {
                    dispatcher = getDispatcherFromConnection(message.guild.voiceConnection);
                }
                try {
                    dispatcher.setVolume(0);
                } catch (e) {

                }
                playSong(message, Song);
            }).catch(winston.info);
        }
    });
};
var getInVoice = function (message, cb) {
    if (message.guild) {
        if (!inVoiceChannel(message)) {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join().then(() => {
                    startQueue(message);
                    cb(null, message);
                }).catch(err => {
                    winston.info(err);
                    return cb(t('joinVoice.error', {lngs: message.lang}));
                });
            } else {
                return cb(t('joinVoice.no-voice', {lngs: message.lang}));
            }
        } else {
            cb(null, message);
        }
    }
};
var setTitle = (msg, title) => {
    queueModel.findOne({server: msg.guild.id}, (err, Queue) => {
        if (err) return winston.error(err);
        if (Queue) {
            if (Queue.songs.length > 0 && Queue.songs[0].type === 'radio') {
                winston.info('Updated Title!');
                Queue.updateTitle(Queue.songs[0].id, title, (err) => {
                    if (err) return winston.error;
                    winston.info('Updated Title to !' + title + ' ');
                });
            }
        }
    });
};
module.exports = {
    inVoice: inVoiceChannel,
    saveVoice: saveVoiceChannel,
    loadVoice: loadLastVoice,
    clearVoice: clearLastVoice,
    joinVoice: joinVoiceChannel,
    nextSong: nextSong,
    playSong: playSong,
    streamSong: streamSong,
    now: nowPlaying,
    getVoiceConnection: getVoiceConnection,
    getVoiceConnectionByServer: getVoiceConnectionServer,
    getVoiceChannel: getVoiceChannel,
    getChannelById: getChannelFromId,
    addSongFirst: addSongFirst,
    startQueue: startQueue,
    autoStartQueue: autoStartQueue,
    addToQueue: addToQueue,
    addToQueueBatch: addToQueueBatch,
    updatePlays: updatePlays,
    setVolume: setVolume,
    checkMedia: checkMedia,
    getDispatcher: getDispatcherFromConnection,
    queueAddRepeat: queueAddRepeat,
    getInVoice: getInVoice
};