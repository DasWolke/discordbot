var youtubedl = require('youtube-dl');
var fs = require('fs');
var download = function (url, cb) {
    youtubedl.getInfo(url, function (err, info) {
        if (err) cb(err);
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
            cb();
        });
        video.on('end', function () {
            console.log('finished downloading!');
            stream.end();
            cb(null, info);
        });
    });
};
module.exports = download;