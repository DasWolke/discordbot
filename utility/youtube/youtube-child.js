var youtubedl = require('youtube-dl');
var ytdl = require('ytdl-core');
var Youtube = require('youtube-api');
var ffmpeg = require('fluent-ffmpeg');
var moment = require('moment');
var request = require('request');
var youtubesearch = require('youtube-search');
var songModel = require('../../DB/song');
var config = require('../../config/main.json');
var fs = require('fs');
var async = require("async");
var voice = require("../voice.js");
var music = require('../music');
var i18nBean = require('../i18nManager');
var t = i18nBean.getT();
var logger = require('../logger');
var mongoose = require("mongoose");
var child_process = require("child_process");
var winston = logger.getT();
var opts = {
    maxResults: 5,
    key: config.youtube_api,
    type: "video"
};
var download = function (url, message, cb) {
    // winston.info(url);
    // let m;
    // if ((m = playlistReg.exec(url)) !== null) {
    //     winston.info('using Playlist!');
    //     downloadPlaylist(url, message, m[1], (err, results) => {
    //         if (err) return winston.info(err);
    //         let table = new AsciiTable;
    //         for (var i = 0; i < results.length; i++) {
    //             table.addRow(i + 1, results[i].title);
    //         }
    //         message.reply(`Downloaded the following Songs:\n \`\`\` ${table.toString()}\`\`\` `);
    //     });
    // } else {
    downloadSingle(url, message, (err, info) => {
        cb(err, info);
    });
    // }
};
var downloadSingle = function (url, message, cb) {
    let child = child_process.fork('./utility/youtube/sub/download.js');
    child.send({url: url, author: message.author.id});
    child.on('message', (m) => {
        if (typeof (m.proxy) !== 'undefined') {
            message.channel.sendMessage(t('voice.use-proxy', {lngs: message.lang}));
        } else {
            child.kill();
            cb(m.err, m.info);
        }
    });
};
var downloadPlaylist = function (url, message, playlistId, cb) {
    Youtube.authenticate({
        type: 'key',
        key: config.youtube_api,
    });
    Youtube.playlistItems.list({
        part: 'contentDetails',
        maxResults: 50,
        playlistId: playlistId,
    }, function (err, data) {
        if (err) return winston.info(err);
        let songs = [];
        let z;
        if ((z = music.ytRegex.exec(url)) !== null) {
            let playlist = searchForIdInPlaylist(data, z[1]);
            async.eachSeries(playlist, (Item, cb) => {
                downloadSingle(`https://youtube.com/watch?v=${Item.contentDetails.videoId}`, message, (err, info) => {
                    if (err) return cb(err);
                    songModel.findOne({id: info.id}, (err, Song) => {
                        if (err) return cb(err);
                        if (Song) {
                            voice.addToQueue(message, Song, false).then((message) => {
                                songs.push(Song);
                                return cb();
                            }).catch(cb);
                        } else {
                            async.setImmediate(() => {
                                return (cb(':x: '));
                            });
                        }
                    });
                })
            }, (err) => {
                if (err) return cb(err);
                cb(null, songs);
            });
        } else {
            cb('Problem extracting ID!');
        }
    });

};
var searchForIdInPlaylist = function (playlist, id) {
    if (cycleThroughPlaylist(playlist, id)) {
        return cycleThroughPlaylist(playlist, id);
    } else {
        return [];
    }
};
var cycleThroughPlaylist = function (playlist, id) {
    for (var i = 0; i < playlist.items.length; i++) {
        if (playlist.items[i].contentDetails.videoId === id) {
            return playlist.items.slice(i, i + 3);
        }
    }
    return null;

};
var search = function (message, cb) {
    var messageSplit = message.content.split(' ');
    var messageClean = "";
    if (typeof(messageSplit[1]) !== 'undefined' && messageSplit[1]) {
        for (var i = 1; i < messageSplit.length; i++) {
            messageClean = messageClean + " " + messageSplit[i];
        }
        youtubesearch(messageClean, opts, function (err, results) {
            if (err) {
                winston.info(err);
                return cb(':x: ');
            }
            if (results.length > 0) {
                cb(null, results[0]);
            } else {
                cb(':x: ');
            }
        });
    } else {
        cb(t('qa.empty-search', {lngs: message.lang}));
    }
};
var downloadProxy = function (message, url, proxy, cb) {
    let proxy_url;
    if (proxy === 0) {
        proxy_url = "http://localhost:7005";
    } else if (proxy === 1) {
        proxy_url = config.dl_url_1;
    } else {
        proxy_url = config.dl_url_2;
    }
    let options = {
        url: `${proxy_url}/api/dl`,
        headers: {
            auth: config.dl_token
        },
        form: {
            url: url
        },
        method: 'POST',
        timeout: 240000
    };
    request(options, (error, response, body) => {
        if (error) {
            // client.captureMessage(error, {extra: {'url': url, 'proxy': proxy}});
            return cb(error);
        }
        let parsedBody = {error: 1};
        try {
            parsedBody = JSON.parse(body);
        } catch (e) {
            // client.captureMessage(e, {extra: {'url': url, 'proxy': proxy, 'json': body}});
        }
        console.log(parsedBody);
        if (parsedBody.error === 0) {
            winston.info(parsedBody.path);
            winston.info(`${proxy_url}${parsedBody.path}`);
            var stream = request(`${proxy_url}/${parsedBody.path}`).on('error', (err) => {
                return cb(err);
            }).pipe(fs.createWriteStream(`audio/${parsedBody.info.id}.mka`));
            stream.on('finish', () => {
                var song = new songModel({
                    title: parsedBody.info.title,
                    alt_title: parsedBody.info.alt_title,
                    id: parsedBody.info.id,
                    addedBy: message.author.id,
                    addedAt: Date.now(),
                    duration: convertDuration(parsedBody.info),
                    type: "audio/mka",
                    url: url,
                    dl: "stream",
                    dlBy: `proxy_${proxy}`,
                    cached: true,
                    cachedAt: new Date(),
                    path: `audio/${parsedBody.info.id}.mka`
                });
                song.save((err) => {
                    if (err) return cb(err);
                    cb(null, parsedBody.info);
                });
            });
        } else {
            if (proxy === 2) {
                // client.captureMessage('The Proxy did not work.', {
                //     extra: {
                //         'url': url,
                //         'proxy': proxy,
                //         'guild': message.guild.name
                //     }
                // });
                return cb('The Proxy did not work.');
            } else {
                downloadProxy(message, url, proxy + 1, cb);
            }
        }
    });
};
var checkTime = function (info) {
    if (typeof (info.duration) === 'undefined' && typeof (info.length_seconds) === 'undefined') {
        // client.captureMessage('Duration undefined!', {extra: {'info': info}});
        return true;
    }
    if (typeof (info.duration) !== 'undefined') {
        let durationSplit = info.duration.split(':');
        if (parseInt(durationSplit.length) > 3) {
            return false;
        } else {
            if (durationSplit.length === 3) {
                if (parseInt(durationSplit[0]) > 1) {
                    return false;
                } else {
                    return ((parseInt(durationSplit[0]) === 1) && parseInt(durationSplit[1]) > 30)
                }
            } else {
                return true;
            }
        }
    } else {
        return (parseInt(info.length_seconds) < 5400);
    }
};
var convertDuration = function (info) {
    let durationConv = "";
    if (typeof (info.duration) === 'undefined' && typeof (info.length_seconds) === 'undefined') {
        // client.captureMessage('Duration undefined!', {extra: {'info': info}});
    }
    if (typeof (info.duration) !== 'undefined') {
        let durationSplit = info.duration.split(':');
        for (var i = 0; i < durationSplit.length; i++) {
            if (i !== durationSplit.length - 1) {
                if (durationSplit[i].length === 1) {
                    durationConv = durationConv + '0' + durationSplit[i] + ':';
                } else {
                    durationConv = durationConv + durationSplit[i] + ':';
                }
            } else {
                if (durationSplit[i].length === 1) {
                    durationConv = durationConv + '0' + durationSplit[i];
                } else {
                    durationConv = durationConv + durationSplit[i];
                }
            }
        }
        winston.info(durationConv);
    } else {
        let d = Number(info.length_seconds);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
    }
    return durationConv;
};
module.exports = {download: download, search: search};
