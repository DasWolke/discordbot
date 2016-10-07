var youtubedl = require('youtube-dl');
var ffmpeg = require('fluent-ffmpeg');
var request = require('request');
var youtubesearch = require('youtube-search');
var songModel = require('../../DB/song');
var config = require('../../config/main.json');
var fs = require('fs');
var errorReporter = require('../errorReporter');
var client = errorReporter.getT();
var opts = {
    maxResults: 5,
    key: config.youtube_api,
    type: "video"
};
var download = function (url, message, cb) {
    if (url.startsWith('https://www.youtube.com/playlist')) {
        return message.reply('Please dont use playlists right now.');
    }
    youtubedl.getInfo(url, function (err, info) {
        if (err) {
            message.reply('Trying to download over the proxy, this could take a bit.');
            downloadProxy(message, url, config.default_proxy, function (err, info) {
                if (err) {
                    return cb(err);
                }
                cb(err, info);
            });
        } else if (checkTime(info)) {
            songModel.findOne({id: info.id}, function (err, Song) {
                if (err) return cb(err);
                if (!Song) {
                    var video = youtubedl(url, ["--restrict-filenames"], {cwd: __dirname});
                    var filename = info.id + ".temp";
                    var stream = video.pipe(fs.createWriteStream('temp/' + filename));
                    video.on('info', function (info) {
                        console.log('Download started');
                        console.log('filename: ' + info._filename);
                        console.log('size: ' + info.size);
                        console.log(`Duration ${info.duration}`);
                    });
                    video.on('complete', function complete(info) {
                        console.log('filename: ' + info._filename + ' finished');
                        cb(null, info);
                    });
                    video.on('end', function () {
                        ffmpeg(fs.createReadStream('temp/' + filename)).output('./audio/' + info.id + '.mp3')
                            .on('stderr', err => {
                                //console.log('Stderr output: ' + err);
                            }).on('error', err => {
                            console.log(err);
                            cb(err);
                        }).on('end', (stdout, stderr) => {
                            console.log('Finished Converting');
                            fs.unlink('temp/' + filename, function (err) {
                                if (err) return cb(err);
                                var song = new songModel({
                                    title: info.title,
                                    alt_title: info.alt_title,
                                    id: info.id,
                                    addedBy: message.author.id,
                                    addedAt: Date.now(),
                                    duration: convertDuration(info.duration),
                                    type: "audio/mp3",
                                    url: url,
                                    dl: "stream",
                                    dlBy:"main",
                                    cached: true,
                                    cachedAt: new Date(),
                                    path: `audio/${info.id}.mp3`
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
var search = function (message, cb) {
    var messageSplit = message.content.split(' ');
    var messageClean = "";
    if (typeof(messageSplit[1]) !== 'undefined' && messageSplit[1]) {
        for (var i = 1; i < messageSplit.length; i++) {
            messageClean = messageClean + " " + messageSplit[i];
        }
        console.log(messageClean);
        youtubesearch(messageClean, opts, function (err, results) {
            if (err) {
                console.log(err);
                return cb('Error with Youtube Search!');
            }
            if (results.length > 0) {
                cb(null, results[0]);
            } else {
                cb('No song found');
            }
        });
    } else {
        cb('No Search Query Provided!');
    }
};
var checkTime = function (info) {
    if (typeof (info.duration) === 'undefined') {
        client.captureMessage('Duration undefined!', {extra:{'info':info}});
    }
    var durationSplit = info.duration.split(':');
    if (parseInt(durationSplit.length) > 3) {
        return false;
    } else {
        if (durationSplit.length === 3) {
            if (parseInt(durationSplit[0]) > 1) {
                return false;
            } else {
                return (!!parseInt(durationSplit[0]) === 1 && parseInt(durationSplit[1]) > 30)
            }
        } else {
            return true;
        }
    }
};
var downloadProxy = function (message, url, proxy, cb) {
    let proxy_url;
    if (proxy === 1) {
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
        timeout:240000
    };
    request(options, (error, response, body) => {
        if (error) {
            client.captureMessage(error, {extra:{'url':url, 'proxy':proxy}});
            return cb(error);
        }
        let parsedBody = JSON.parse(body);
        if (parsedBody.error === 0) {
            console.log(parsedBody.path);
            console.log(`${proxy_url}${parsedBody.path}`);
            var stream = request(`${proxy_url}${parsedBody.path}`).on('error', (err) => {
                return cb(err);
            }).pipe(fs.createWriteStream(`audio/${parsedBody.info.id}.mp3`));
            stream.on('finish', () => {
                var song = new songModel({
                    title: parsedBody.info.title,
                    alt_title: parsedBody.info.alt_title,
                    id: parsedBody.info.id,
                    addedBy: message.author.id,
                    addedAt: Date.now(),
                    duration: convertDuration(parsedBody.info.duration),
                    type: "audio/mp3",
                    url: url,
                    dl: "stream",
                    dlBy: `proxy_${proxy}`,
                    cached: true,
                    cachedAt: new Date(),
                    path: `audio/${parsedBody.info.id}.mp3`
                });
                song.save((err) => {
                    if (err) return cb(err);
                    cb(null, parsedBody.info);
                });
            });
        } else {
            console.log(parsedBody);
            if (proxy === 2) {
                client.captureMessage('The Proxy did not work.', {extra:{'url':url, 'proxy':proxy, 'guild':message.guild.name}});
                return cb('The Proxy did not work.');
            } else {
                downloadProxy(message, url, 2, cb);
            }
        }
    });
};
var convertDuration = function (duration) {
    let durationConv = "";
    if (typeof (duration) === 'undefined') {
        client.captureMessage('Duration undefined!', {extra:{'info':info}});
    }
    var durationSplit = duration.split(':');
    for (var i = 0; i < durationSplit.length; i++) {
        if (i !== durationSplit.length -1) {
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
    console.log(durationConv);
    return durationConv;
};
module.exports = {download: download, search: search};