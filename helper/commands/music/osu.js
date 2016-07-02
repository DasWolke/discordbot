/**
 * Created by julia on 27.06.2016.
 */
var osuapi = require('osu-api');
var config = require('../../../config/main.json');
var fs = require('fs');
var osu = new osuapi.Api(config.osu_token);
var request = require('request');
request = request.defaults({jar: true});
var unzip = require('unzip');
var songModel = require('../../../DB/song');
var shortid = require('shortid');
var getOsu = function getMap(bot, message, map) {
    var FileError = false;
    var setRegex = /.*http(s|):\/\/osu.ppy.sh\/(s|b)\/([0-9]*)((\?|\&)m=[0-9]|)/;
    var info = {};
    if (setRegex.test(map)) {
        var mapType = JSON.parse('{"' + map.replace(setRegex, '$2') + '": ' + map.replace(setRegex, '$3') + '}');
        osu.getBeatmapsRaw(mapType, function (err, info) {
            if (err) console.log(err);
            songModel.findOne({dl: "osu", setId: info[0].beatmapset_id}, function (err, Song) {
                if (err) return console.log(err);
                if (Song) {
                    return bot.reply(message, "The Song " + Song.title + " is already Downloaded!");
                } else {
                    var path = config.osu_path;
                    info = info[0];
                    if (info.approved == "3" || info.approved == "2" || info.approved == "1" || info.approved == "0" || info.approved == "-1" || info.approved == "-2") {
                        // console.log(map.replace(setRegex, '$2'));
                        // console.log(info.title.replace(/(\\|\/|:|\*|\?|"|<|>|\|)/g, '').toLowerCase());
                        //var fileRar = fs.createWriteStream("tmp.osz");
                        var songPath = "";
                        var extension = "";
                        fs.stat(path + info.beatmapset_id + ".zip", function (err, stat) {
                            if (err == null) {
                                bot.reply(message, info.title + " is already being downloaded");
                            } else {
                                var url = 'http://osu.ppy.sh/d/' + info.beatmapset_id;
                                bot.reply(message, "map: " + info.title + " is being downloaded");
                                request.post({
                                    url: "https://osu.ppy.sh/forum/ucp.php?mode=login",
                                    formData: {
                                        login: "Login",
                                        password: config.osu_password,
                                        username: config.osu_username
                                    }
                                }, function (err, res, body) {
                                    if (err) {
                                        return console.error(err);
                                    }
                                    var notAvailableRegex = /This download is no longer available/i;
                                    var notAvailable = false;
                                    // console.log(config.osu_path + info.beatmapset_id + ".zip");
                                    var stream = fs.createWriteStream(config.osu_path + info.beatmapset_id + ".zip");
                                    request.get('https://osu.ppy.sh/d/' + info.beatmapset_id, function (err, res, body) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        if (notAvailableRegex.test(body)) {
                                            bot.reply(message, info.title + " is not available to download");
                                            notAvailable = true;
                                            stream.end();
                                            return;
                                        }
                                    }).pipe(stream).on('finish', function () {
                                        stream.end();
                                        // console.log("finished downloading");
                                        fs.mkdir(path + info.beatmapset_id + '/', function (err) {
                                            if (err) console.log(err);
                                        });
                                        if (!notAvailable) {
                                            try {
                                                fs.createReadStream('./audio/osu/' + info.beatmapset_id + '.zip').pipe(unzip.Extract({path: 'audio/osu/' + info.beatmapset_id + '/'}));
                                            } catch (e) {
                                                if (e) return console.log(e);
                                            }
                                            setTimeout(function () {
                                                fs.readdir(path + info.beatmapset_id + '/', function (error, files) {
                                                    var pathRegex = /(\\|\/|:|\*|\?|"|<|>|\|)/g;
                                                    if (error) console.log("something went wrong");

                                                    fs.stat(path + info.beatmapset_id + "/" + info.artist.replace(/(\\|\/|:|\*|\?|"|<|>|\|)/g, '') + " - " + info.title.replace(pathRegex, '') + " (" + info.creator.replace(pathRegex, '') + ") [" + info.version.replace(pathRegex, '') + "].osu", function (error, stats) {
                                                        if (error == null) {
                                                            fs.open(path + info.beatmapset_id + "/" + info.artist.replace(pathRegex, '') + " - " + info.title.replace(pathRegex, '') + " (" + info.creator.replace(pathRegex, '') + ") [" + info.version.replace(pathRegex, '') + "].osu", "r", function (error, fd) {
                                                                var buffer = new Buffer(stats.size);

                                                                fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
                                                                    var data = buffer.toString("utf8", 0, buffer.length).split('\n');

                                                                    songPath = data[3].replace(/AudioFilename: (.*(\.mp3|\.ogg))/i, '$1').split('\r')[0];
                                                                    extension = data[3].replace(/AudioFilename: (.*(\.mp3|\.ogg))/i, '$2').split('\r')[0].trim();
                                                                    songPath = songPath.trim();
                                                                    // console.log('"' + songPath + '"');
                                                                    fs.close(fd);
                                                                });
                                                            });
                                                        } else {
                                                            bot.reply(message, "Something went wrong while downloading " + info.title);
                                                            FileError = true;
                                                        }
                                                    });
                                                });
                                                if (!FileError) {
                                                    console.log(info.beatmapset_id);
                                                    setTimeout(function () {
                                                        var id = shortid.generate();
                                                        var song = new songModel({
                                                            title: info.title,
                                                            alt_title: info.alt_title,
                                                            path: "audio/osu/" + id + ".mp3",
                                                            id: id,
                                                            addedBy: message.author.id,
                                                            addedAt: Date.now(),
                                                            type: "audio/mp3",
                                                            url: map,
                                                            setId: info.beatmapset_id,
                                                            dl: "osu"
                                                        });
                                                        song.save();
                                                        console.log(path + info.beatmapset_id + "/" + songPath, path + id + extension);
                                                        fs.rename(path + info.beatmapset_id + "/" + songPath, path + id + extension, function (err) {
                                                            if (err) return console.log(err);
                                                        });
                                                    }, 100);
                                                    setTimeout(function () {
                                                        deleteFolderRecursive(path + info.beatmapset_id + "/");
                                                        fs.unlink(path + info.beatmapset_id + ".zip");
                                                        // fillArrays();
                                                        console.log("Getmap is complete now!");
                                                        bot.reply(message, info.title + " has been downloaded");
                                                    }, 2000);
                                                }
                                            }, 3000);

                                        }
                                    });
                                    if (notAvailable || FileError) {
                                        deleteFolderRecursive(path + info.beatmapset_id + "/");
                                        fs.unlink(path + info.beatmapset_id + ".zip");
                                    }
                                });
                            }
                        });
                    } else {
                        bot.reply(message, info.title + " have already been downloaded");
                    }
                }
            });
        });
    } else {
        bot.reply(message, "This Link is not a Osu Link!");
    }
};
var deleteFolderRecursive = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
module.exports = getOsu;