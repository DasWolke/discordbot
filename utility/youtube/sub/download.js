var music = require("../../music.js");
var youtubedl = require('youtube-dl');
var ytdl = require('ytdl-core');
var fs = require("fs");
var winston = require('winston');
var mongoose = require("mongoose");
var ffmpeg = require('fluent-ffmpeg');
let url;
var config = require('../../../config/main.json');
if (config.beta) {
    url = 'mongodb://localhost/discordbot-beta';
} else {
    url = 'mongodb://localhost/discordbot';
}
mongoose.connect(url, (err) => {
    if (err) {
        return winston.error("Unable to connect to Mongo Server!");
    }
});
var songModel = require('../../../DB/song');
var child_process = require("child_process");
process.on('message', (m) => {
    downloadSingle(m.url, m.author, (err, info) => {
        process.send({err: err, info: info});
    })
});
var downloadSingle = function (url, idAuthor, cb) {
    let dl;
    if (music.ytRegex.test(url)) {
        dl = ytdl;
    } else {
        dl = youtubedl;
    }
    dl.getInfo(url, function (err, info) {
        if (err) {
            process.send({proxy: true});
            let child = child_process.fork('./utility/youtube/sub/downloadProxy.js');
            child.send({url: url, author: idAuthor});
            child.on('message', (m) => {
                // console.log(m);
                child.kill();
                cb(m.err, m.info);
            });
            // message.channel.sendMessage(t('voice.use-proxy', {lngs: message.lang}));
            // downloadProxy(message, url, config.default_proxy, function (err, info) {
            //     if (err) {
            //         return cb(err);
            //     }
            //     cb(err, info);
            // });
        } else if (checkTime(info)) {
            // winston.info(checkTime(info));
            let id;
            if (music.ytRegex.test(url)) {
                id = info.video_id;
            } else {
                id = info.id;
            }
            info.id = id;
            songModel.findOne({id: id}, function (err, Song) {
                if (err) return cb(err);
                if (!Song) {
                    // downloadProxy(message, url, 0, (err, info) => {
                    //     if (err) {
                    //         return cb(err);
                    //     }
                    //     cb(null, info);
                    // });
                    var video;
                    if (music.ytRegex.test(url)) {
                        video = youtubedl(url, ["--restrict-filenames", "-4", "--prefer-free-formats"], {
                            cwd: __dirname,
                            maxBuffer: Infinity
                        });
                    } else {
                        video = youtubedl(url, ["--restrict-filenames", "-4"], {
                            cwd: __dirname,
                            maxBuffer: Infinity
                        });
                    }
                    video.on('error', function (err) {
                        // console.log(err);
                    });
                    var filename = info.id + ".temp";
                    var stream = video.pipe(fs.createWriteStream('temp/' + filename));
                    video.on('info', function (info) {
                        winston.info('Download started');
                        winston.info('filename: ' + info._filename);
                        winston.info('size: ' + info.size);
                        winston.info('duration: ' + info.duration);
                    });
                    video.on('complete', function complete(info) {
                        winston.info('filename: ' + info._filename + ' finished');
                        cb(null, info);
                    });
                    video.on('end', function () {
                        ffmpeg(fs.createReadStream('temp/' + filename)).output('./audio/' + id + '.mka').outputOptions(['-vn', '-acodec copy'])
                            .on('stderr', err => {

                            }).on('error', err => {
                            winston.info(err);
                            return cb(err);
                        }).on('end', (stdout, stderr) => {
                            winston.info('Finished Converting');
                            fs.unlink('temp/' + filename, function (err) {
                                if (err) return cb(err);
                                var song = new songModel({
                                    title: info.title,
                                    alt_title: info.alt_title,
                                    id: id,
                                    addedBy: idAuthor,
                                    addedAt: Date.now(),
                                    duration: convertDuration(info),
                                    type: "audio/mka",
                                    url: url,
                                    dl: "stream",
                                    dlBy: "main",
                                    cached: true,
                                    cachedAt: new Date(),
                                    path: `audio/${id}.mka`
                                });
                                song.save(function (err) {
                                    if (err) return cb(err);
                                    cb(null, info);
                                });
                            });
                        }).run();
                    });
                } else {
                    cb(null, info);
                }
            });
        }
        else {
            cb('The Song is to long.', info);
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