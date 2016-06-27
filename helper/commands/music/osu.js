/**
 * Created by julia on 27.06.2016.
 */
var osuapi = require('osu-api');
var osu = new osuapi.Api('0ccfafd6b4213cb44a8ac0f1ee2ef6855f5d47d4');
function getMap(message, channelID, user, userID, cmd) {
    var FileError = false;
    var setRegex = /.*http(s|):\/\/osu.ppy.sh\/(s|b)\/([0-9]*)((\?|\&)m=[0-9]|)/;
    var info = {};
    if (setRegex.test(message)) {
        var mapType = JSON.parse('{"' + message.replace(setRegex, '$2') + '": ' + message.replace(setRegex, '$3') + '}');
        osu.getBeatmapsRaw(mapType, function(err ,info) {
            if (err) console.log(err);
            var path = settings.path;
            info = info[0];
            if (info.approved == "3" || info.approved == "2" || info.approved == "1" || info.approved == "0" && mods.indexOf(user) > -1 || info.approved == "-1" && mods.indexOf(user) > -1 || info.approved == "-2" && mods.indexOf(user) > -1) {
                if (names.indexOf(info.title.replace(/(\\|\/|:|\*|\?|"|<|>|\|)/gi, '').toLowerCase()) <= -1) {
                    console.log(message.replace(setRegex, '$2'));
                    console.log(names.indexOf(info.title.replace(/(\\|\/|:|\*|\?|"|<|>|\|)/g, '').toLowerCase()) <= -1);
                    //var fileRar = fs.createWriteStream("tmp.osz");
                    var songPath = "";
                    var extension = "";
                    fs.stat(path + info.beatmapset_id + ".zip", function(err, stat) {
                        if(err == null) {
                            bot.sendMessage({to:channelID,message: info.title + " is already being downloaded"});
                        } else {
                            var url = 'http://osu.ppy.sh/d/' + info.beatmapset_id;
                            bot.sendMessage({to:channelID,message: info.title + " is being downloaded"});
                            request.post({url: "https://osu.ppy.sh/forum/ucp.php?mode=login", formData: {login:"Login", password: settings['osu-password'], username: settings['osu-username']}}, function(err, res, body) {
                                if(err) {
                                    return console.error(err);
                                }
                                //console.log(res);
                                var notAvailableRegex = /This download is no longer available/i;
                                var notAvailable = false;
                                request.get('https://osu.ppy.sh/d/' + info.beatmapset_id, function(err, res, body) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    if (notAvailableRegex.test(body)) {
                                        bot.sendMessage({to:channelID,message: info.title + " is not available to download"});
                                        notAvailable = true;
                                        return;
                                    }
                                }).pipe(fs.createWriteStream(info.beatmapset_id + ".zip")).on('finish', function() {
                                    console.log("finished downloading");
                                    fs.mkdir(path + info.beatmapset_id + '/', function (err) {
                                        if (err) console.log(err);
                                    });
                                    if (!notAvailable) {
                                        exec('"C:/Program Files/WinRAR/WinRAR.exe" x -ibck -x*.png C:/Red-Bot/' + info.beatmapset_id + '.zip ' + path + info.beatmapset_id + '/', function (error) {
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                setTimeout(function(){
                                                    fs.readdir(path + info.beatmapset_id + '/', function(error, files) {
                                                        var pathRegex = /(\\|\/|:|\*|\?|"|<|>|\|)/g;
                                                        if (error) console.log("something went wrong");

                                                        fs.stat(path + info.beatmapset_id + "/" + info.artist.replace(/(\\|\/|:|\*|\?|"|<|>|\|)/g, '') + " - " + info.title.replace(pathRegex, '') + " (" + info.creator.replace(pathRegex, '') + ") [" + info.version.replace(pathRegex, '') + "].osu", function(error, stats) {
                                                            if (error == null) {
                                                                fs.open(path + info.beatmapset_id + "/" + info.artist.replace(pathRegex, '') + " - " + info.title.replace(pathRegex, '') + " (" + info.creator.replace(pathRegex, '') + ") [" + info.version.replace(pathRegex, '') + "].osu", "r", function(error, fd) {
                                                                    var buffer = new Buffer(stats.size);

                                                                    fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
                                                                        var data = buffer.toString("utf8", 0, buffer.length).split('\n');

                                                                        songPath = data[3].replace(/AudioFilename: (.*(\.mp3|\.ogg))/i, '$1').split('\r')[0];
                                                                        extension = data[3].replace(/AudioFilename: (.*(\.mp3|\.ogg))/i, '$2').split('\r')[0].trim();
                                                                        songPath = songPath.trim();
                                                                        console.log('"' + songPath + '"');
                                                                        fs.close(fd);
                                                                    });
                                                                });
                                                            } else {
                                                                bot.sendMessage({to:channelID,message: "Something went wrong when downloading " + info.title});
                                                                FileError = true;
                                                            }
                                                        });
                                                    });
                                                    if (!FileError) {
                                                        setTimeout(function() {
                                                            fs.rename(path + info.beatmapset_id + "/" + songPath, path + "music/" + info.title.replace(/(\\|\/|:|\*|\?|"|<|>|\|)/g, '')+ extension, function (err) {
                                                                if (err) console.log(err);
                                                            });
                                                            fs.readFile(path + "songs.txt", 'utf8', function (err, data) {
                                                                if (err) console.log(err);
                                                                fs.writeFile(path + "songs.txt", data + "\n" + info.title.replace(/(\\|\/|:|\*|\?|"|<|>|\|)/g, '') + extension, 'utf8', function (err) {
                                                                    if (err) console.log(err + "SOMETHING WENT WRONG");
                                                                    songs.push(info.title + ".mp3");

                                                                });
                                                            });
                                                            fs.readFile(path + "names.txt", 'utf8', function (err, data) {
                                                                if (err) console.log(err);
                                                                fs.writeFile(path + "names.txt", data + "\n" + info.title, 'utf8', function (err) {
                                                                    if (err) console.log(err + "SOMETHING WENT WRONG");
                                                                    names.push(info.title);
                                                                });
                                                            });
                                                        }, 100);
                                                        setTimeout(function(){
                                                            deleteFolderRecursive(path + info.beatmapset_id + "/");
                                                            fs.unlink(path + info.beatmapset_id + ".zip");
                                                            fillArrays();
                                                            console.log("Getmap is complete now!");
                                                            bot.sendMessage({to:channelID,message: info.title + " has been downloaded"});
                                                        }, 2000);
                                                    }
                                                }, 3000);

                                            }
                                        });
                                    }
                                    if (notAvailable || FileError) {
                                        deleteFolderRecursive(path + info.beatmapset_id + "/");
                                        fs.unlink(path + info.beatmapset_id + ".zip");
                                    }
                                })

                            });
                        }
                    });
                } else {
                    bot.sendMessage({to:channelID,message: info.title + " have already been downloaded"});
                }
            } else {
                bot.sendMessage({to:channelID,message: "Only mods can download unranked maps"});
            }
        });
    }
}