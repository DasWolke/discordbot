var youtubedl = require('youtube-dl');
var songModel = require('../../DB/song');
var fs = require('fs');
var download = function (url, message, cb) {
    youtubedl.getInfo(url, function (err, info) {
        if (err) return cb(err);
        songModel.findOne({id:info.id}, function (err, Song) {
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
                        id:info.id,
                        addedBy:message.author.id,
                        addedAt:Date.now(),
                        type:"audio/mp3",
                        url:info.webpage_url
                    });
                    song.save();
                    stream.end();
                    cb(null, info);
                });
            } else {
                cb(null, info);
            }
        });
    });
};
module.exports = download;