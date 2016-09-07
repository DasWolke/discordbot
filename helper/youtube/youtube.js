var youtubedl = require('youtube-dl');
var ffmpeg = require('fluent-ffmpeg');
var ytdl_core = require('ytdl-core');
var youtubesearch = require('youtube-search');
var songModel = require('../../DB/song');
var config = require('../../config/main.json');
var fs = require('fs');
var opts = {
    maxResults:5,
    key:config.youtube_api,
    type:"video"
};
var download = function (url, message, cb) {
    youtubedl.getInfo(url, function (err, info) {
        if (err) return cb(err);
        if (checkTime(info.duration)) {
            songModel.findOne({id: info.id}, function (err, Song) {
                if (err) return cb(err);
                if (!Song) {
                    console.log('test');
                    // youtubedl.exec(url, ['-x', '--audio-format', 'mp3', '-j', '-o', '\"%(id)s.%(ext)s\"'], {}, function(err, output) {
                    //     if (err) console.log(err);
                    //     console.log(output);
                    // });
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
                        console.log('finished downloading!');
                        ffmpeg(fs.createReadStream('temp/' + filename)).output('./audio/' + info.id + '.mp3')
                            .on('stderr', err => {
                                console.log('Stderr output: ' + err);
                            }).on('error', err => {
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
        } else {
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
        youtubesearch(messageClean, opts, function (err,results) {
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
    console.log(durationSplit);
    console.log(parseInt(durationSplit[0]));
    var number = parseInt(durationSplit[0]);
    console.log(parseInt(durationSplit[0]) > 1);
    if (parseInt(durationSplit.length) > 3) {
        return false;
    } else {
        if (durationSplit.length === 3) {
            if (parseInt(durationSplit[0]) > 1) {
                return false;
            } else {
                if (parseInt(durationSplit[0]) === 1 && parseInt(durationSplit[1])> 30) {
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
module.exports = {download:download, search:search};