var youtubedl = require('youtube-dl');
var youtubesearch = require('youtube-search');
var songModel = require('../../DB/song');
var config = require('../../config/main.json');
var fs = require('fs');
var opts = {
    maxResults:5,
    key:config.youtube_api
};
var download = function (url, message, cb) {
    youtubedl.getInfo(url, function (err, info) {
        if (err) return cb(err);
        if (checkTime(info.duration)) {
            songModel.findOne({id: info.id}, function (err, Song) {
                if (err) return cb(err);
                if (!Song) {
                    var video = youtubedl(url, ["--restrict-filenames", "-x", "--audio-format=mp3"], {cwd: __dirname});
                    var filename = info.id + ".mp3";
                    var stream = fs.createWriteStream('audio/' + filename);
                    video.pipe(stream);
                    video.on('info', function (info) {
                        console.log('Download started');
                        console.log('filename: ' + info._filename);
                        console.log('size: ' + info.size);
                    });
                    video.on('complete', function complete(info) {
                        console.log('filename: ' + info._filename + ' finished');
                        cb(null, info);
                    });
                    video.on('end', function () {
                        console.log('finished downloading!');
                        var song = new songModel({
                            title: info.title,
                            alt_title: info.alt_title,
                            path: "audio/" + info.id + ".mp3",
                            id: info.id,
                            addedBy: message.author.id,
                            addedAt: Date.now(),
                            type: "audio/mp3",
                            url: info.webpage_url,
                            dl: "other"
                        });
                        song.save(function (err) {
                            if (err) return cb(err);
                            stream.end();
                            cb(null, info);
                        });
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
    if (parseInt(durationSplit.length) > 3) {
        return false;
    } else {
        if (durationSplit.length === 3) {
            if (parseInt(durationSplit[0] > 1)) {
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