var youtubedl = require('youtube-dl');
var ffmpeg = require('fluent-ffmpeg');
var ytdl_core = require('ytdl-core');
var request = require('request');
var youtubesearch = require('youtube-search');
var songModel = require('../../DB/song');
var config = require('../../config/main.json');
var fs = require('fs');
var opts = {
    maxResults: 5,
    key: config.youtube_api,
    type: "video"
};
var download = function (url, message, cb) {
    youtubedl.getInfo(url, function (err, info) {
        if (err) {
            message.reply('Trying to download over the proxy, this could take a bit.');
            downloadProxy(message, url,function (err,info) {
                if (err) return cb(err);
                cb(err, info);
            });
        } else if (checkTime(info.duration)) {
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
                                        duration:info.duration,
                                        type: "audio/mp3",
                                        url: url,
                                        dl: "stream",
                                        cached:true,
                                        cachedAt:new Date(),
                                        path:`audio/${info.id}.mp3`
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
                cb('Did not Found a Song');
            }
        });
    } else {
        cb('No Search Query Provided!');
    }
};
var checkTime = function (duration) {
    var durationSplit = duration.split(':');
    if (parseInt(durationSplit.length) > 3) {
        return false;
    } else {
        if (durationSplit.length === 3) {
            if (parseInt(durationSplit[0]) > 1) {
                return false;
            } else {
                if (parseInt(durationSplit[0]) === 1 && parseInt(durationSplit[1]) > 30) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return true;
        }
    }
};
var downloadProxy = function (message,url, cb) {
    let options = {
        url: `${config.dl_url}/api/dl`,
        headers: {
            auth: config.dl_token
        },
        form: {
            url: url
        },
        method: 'POST'
    };
    request(options, (error, response, body) => {
        if (error) {
            console.log(error);
            return cb('Small Problem.');
        }
        let parsedBody = JSON.parse(body);
        if (parsedBody.error === 0) {
            console.log(parsedBody.path);
            console.log(`${config.dl_url}${parsedBody.path}`);
            var stream = request(`${config.dl_url}${parsedBody.path}`).on('error', (err) => {
                return cb(err);
            }).pipe(fs.createWriteStream(`audio/${parsedBody.info.id}.mp3`));
            stream.on('finish', () => {
                var song = new songModel({
                    title: parsedBody.info.title,
                    alt_title: parsedBody.info.alt_title,
                    id: parsedBody.info.id,
                    addedBy: message.author.id,
                    addedAt: Date.now(),
                    duration: parsedBody.info.duration,
                    type: "audio/mp3",
                    url: url,
                    dl: "stream",
                    dlBy:"proxy",
                    cached: true,
                    cachedAt: new Date(),
                    path: `audio/${parsedBody.info.id}.mp3`
                });
                song.save((err) => {
                    if (err) return cb(err);
                    cb(null, info);
                });
            });
        } else {
            console.log(parsedBody);
            return cb('The Proxy did not work.');
        }
    });
};
module.exports = {download: download, search: search};