/**
 * Created by julia on 18.07.2016.
 */
var request = require('request');
var osuapi = require('osu-api');
var config = require('../../config/main.json');
var osu = new osuapi.Api(config.osu_token);
var setRegex = /.*http(s|):\/\/osu.ppy.sh\/(b)\/([0-9]*)((\?|\&)m=[0-9]|)/;
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
var calcPP = function (bot, message) {
    var messageSplit = message.content.split(' ');
    if (messageSplit[1]) {
        var map = messageSplit[1];
        var mapId;
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
            osu.getBeatmapsRaw(mapType, function (err, info) {
                if (err) console.log(err);
                if (typeof (info) !== 'undefined' && info) {
                    mapId = info[0].beatmap_id;
                    var mapInfo = info[0];
                    if (typeof (mapId) !== 'undefined') {
                        request('https://next.itsyuka.pw/pp?b=' + mapId + '&acc=' + Accuracy + '&mods=' + modNumber, function (err, res, body) {
                            if (err) return console.log(err);
                            console.log(body);
                            try {
                                var parsedBody = JSON.parse(body);
                            } catch (e) {
                                return message.reply('Could not read Api Response!');
                            }
                            message.reply(`PP for Map \`${mapInfo.artist} - ${mapInfo.title} [${parsedBody.version}] with Acc ${parsedBody.acc}%\` \`${parsedBody.pp}\` \` ${modString(parsedBody.mods)}\` `).then().catch(console.log);
                        });
                    } else {
                        console.log('well...');
                    }
                } else {
                    message.reply('The Osu api seems to have a small problem.');
                }
            });
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
module.exports = {calcPP: calcPP};