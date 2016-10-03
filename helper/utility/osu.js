/**
 * Created by julia on 18.07.2016.
 */
var request = require('request');
request = request.defaults({jar: true});
var config = require('../../config/main.json');
const osu = require('node-osu');
var fs = require('fs');
var unzip = require('unzip');
var shortid = require('shortid');
var musicHelper = require('./../../utility/music');
var setRegex = /.*http(s|):\/\/osu.ppy.sh\/(b)\/([0-9]*)((\?|\&)m=[0-9]|)/;
var osuApi = new osu.Api(config.osu_token);
var Mods = {
    None: 0,
    NoFail: 1 << 0,
    Easy: 1 << 1,
    Hidden: 1 << 3,
    HardRock: 1 << 4,
    SuddenDeath: 1 << 5,
    DoubleTime: 1 << 6,
    Relax: 1 << 7,
    HalfTime: 1 << 8,
    Nightcore: 1 << 9,
    Flashlight: 1 << 10,
    Autoplay: 1 << 11,
    SpunOut: 1 << 12,
    Relax2: 1 << 13,
    Perfect: 1 << 14,
    Key4: 1 << 15,
    Key5: 1 << 16,
    Key6: 1 << 17,
    Key7: 1 << 18,
    Key8: 1 << 19,
    FadeIn: 1 << 20,
    Random: 1 << 21,
    Cinema: 1 << 22,
    Target: 1 << 23,
    Key9: 1 << 24,
    Key10: 1 << 25,
    Key1: 1 << 26,
    Key3: 1 << 27,
    Key2: 1 << 28,
    LastMod: 1 << 29
};
var calcPP = function (message) {
    var messageSplit = message.content.split(' ');
    if (messageSplit[1]) {
        let map = messageSplit[1];
        var Accuracy = 95;
        try {
            Accuracy = parseInt(messageSplit[2]);
        } catch (e) {
        }
        if (isNaN(Accuracy)) {
            Accuracy  = 95;
        }
        if (setRegex.test(map)) {
            var modNumber = calcMods(message);
            var mapType = JSON.parse('{"' + map.replace(setRegex, '$2') + '": ' + map.replace(setRegex, '$3') + '}');
            osuApi.getBeatmaps(mapType).then(beatmaps => {
                if (typeof (beatmaps) !== 'undefined' && beatmaps.length > 0) {
                    let beatmap = beatmaps[0];
                    if (typeof (beatmap.id) !== 'undefined') {
                        request(`https://next.itsyuka.pw/pp?b=${beatmap.id}&acc=${Accuracy}&mods=${modNumber}`, function (err, res, body) {
                            if (err) return console.log(err);
                            try {
                                var parsedBody = JSON.parse(body);
                            } catch (e) {
                                return message.reply('Could not read Api Response!');
                            }
                            message.reply(`PP for Map \`${beatmap.artist} - ${beatmap.title} [${parsedBody.version}] with Acc ${parsedBody.acc}%\` \`${parsedBody.pp}\` \` ${modString(parsedBody.mods)}\` `).then().catch(console.log);
                        });
                    } else {
                        console.log('well...');
                    }
                } else {
                    message.reply('The Osu api seems to have a small problem.');
                }
            }).catch();
        } else {
            message.reply('This is not a valid osu link!');
        }
    } else {
        message.reply('No Map Link Supplied!');
    }
};
var calcMods = function (message) {
    var messageSplit = message.content.split(' ').splice(1);
    var modNum = 0;
    if (messageSplit.length > 1) {
        for (var i = 0; i < messageSplit.length; i++) {
            if (messageSplit[i].toLowerCase() === 'nf') {
                modNum |= Mods.NoFail;
            }
            if (messageSplit[i].toLowerCase() === 'es') {
                modNum |= Mods.Easy;
            }
            if (messageSplit[i].toLowerCase() === 'hd') {
                modNum |= Mods.Hidden;
            }
            if (messageSplit[i].toLowerCase() === 'hr') {
                modNum |= Mods.HardRock;
            }
            if (messageSplit[i].toLowerCase() === 'sd') {
                modNum |= Mods.SuddenDeath;
            }
            if (messageSplit[i].toLowerCase() === 'dt') {
                modNum |= Mods.DoubleTime;
            }
            if (messageSplit[i].toLowerCase() === 'nc') {
                modNum |= Mods.Nightcore;
            }
            if (messageSplit[i].toLowerCase() === 'fl') {
                modNum |= Mods.Flashlight;
            }
            if (messageSplit[i].toLowerCase() === 'sp') {
                modNum |= Mods.SpunOut;
            }
        }
    }
    return modNum;
};
let modString = function (modArray) {
    let string = "";
    modArray.map(mod => {
        string = string + mod + " ";
    });
    return string;
};
var osuMapDownload = (message) => {
    return new Promise((resolve, reject) => {
        downloadOsuMap(message).then((map) => {
            unpackOsuMap(map).then(map => {
                saveOsuMap(map).then((song) => {
                    resolve(song);
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    });
};
var downloadOsuMap = (message) => {
    return new Promise((resolve, reject) => {
        let setRegex = /.*http(s|):\/\/osu.ppy.sh\/(s|b)\/([0-9]*)((\?|\&)m=[0-9]|)/;
        let messageArgs = message.content.split(' ').splice(1);
        let notAvailableRegex = /This download is no longer available/i;
        if (messageArgs && messageArgs[0] && setRegex.test(messageArgs[0])) {
            let map = messageArgs[0];
            let mapType = JSON.parse('{"' + map.replace(setRegex, '$2') + '": ' + map.replace(setRegex, '$3') + '}');
            osuApi.getBeatmaps(mapType).then(beatmaps => {
                if (beatmaps.length > 0) {
                    let setId = beatmaps[0].beatmapSetId;
                    let beatmap = beatmaps[0];
                    request.post({
                        url: "https://osu.ppy.sh/forum/ucp.php?mode=login",
                        formData: {
                            login: "Login",
                            password: config.osu_password,
                            username: config.osu_username
                        }
                    }, (err, res, body) => {
                        if (err) reject(err);
                        let url = 'http://osu.ppy.sh/d/' + setId;
                        let stream = fs.createWriteStream(`temp/${setId}.zip`);
                        request.get(url, (err, res, body) => {
                            if (err) {
                                reject('Internal Error!');
                            }
                            if (notAvailableRegex.test(body)) {
                                stream.end();
                                reject(`${beatmap.artist} ${beatmap.title} is not available to download`);
                            }
                        }).pipe(stream).on('finish', () => {
                            stream.end();
                            beatmap.path = `temp/${setId}.zip`;
                            beatmap.addedBy = message.author.id;
                            beatmap.link = map;
                            resolve(beatmap);
                        });
                    });
                }
            }).catch(reject);
        } else {
            reject('Please add an osu! beatmap link.');
        }
    });
};
var unpackOsuMap = (map) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(map.path)
            .pipe(unzip.Parse())
            .on('entry', function (entry) {
                var audioReg = /.*\.(?:mp3|ogg)/g;
                var fileName = entry.path;
                var type = entry.type; // 'Directory' or 'File'
                if (audioReg.test(fileName) && type === 'File') {
                    map.fileId = shortid.generate();
                    map.path = `audio/osu/${map.fileId}.mp3`;
                    try {
                        entry.pipe(fs.createWriteStream(map.path));
                    } catch (e) {
                        reject(e);
                    }
                    resolve(map);
                } else {
                    entry.autodrain();
                }
            });
        setTimeout(() => {
            reject('No Song Found!');
        }, 10000);
    });
};
var saveOsuMap = (map) => {
    return new Promise((resolve, reject) => {
        fs.unlink(`temp/${map.beatmapSetId}.zip`, err => {
            if (err) reject (err);
            musicHelper.createSong(`${map.artist} - ${map.title}`, map.alt_title, map.fileId, map.addedBy, "", map.link, "osuV2", map.path, "server_main", map.beatmapSetId).then((song) => {
                resolve(song);
            }).catch(reject);
        });
    });
};
module.exports = {calcPP: calcPP, download:osuMapDownload};