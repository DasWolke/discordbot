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
        if (messageSplit[2]) {
            Accuracy = parseFloat(messageSplit[2]);
        } else {

        }
        if (setRegex.test(map)) {
            var modNumber = calcMods(message);
            var mapType = JSON.parse('{"' + map.replace(setRegex, '$2') + '": ' + map.replace(setRegex, '$3') + '}');
            osu.getBeatmapsRaw(mapType, function (err, info) {
                if (err) console.log(err);
                mapId = info[0].beatmap_id;
                var mapInfo = info[0];
                if (typeof (mapId) !== 'undefined') {
                    request('https://next.itsyuka.pw/pp?b=' + mapId + '&acc=' + Accuracy + '&mods=' + modNumber, function (err, res, body) {
                        if (err) return console.log(err);
                        console.log(body);
                        var parsedBody = JSON.parse(body);
                        bot.reply(message, 'PP for Map ' + mapInfo.artist + ' - ' + mapInfo.title + ' [' + parsedBody.version + '] with Acc ' + parsedBody.acc + '% `' + parsedBody.pp + '`');
                    });
                } else {
                    console.log('well...');
                }
            });
        } else {
            bot.reply(message, 'This is not a valid osu link!');
        }
    } else {
        bot.reply(message, 'No Map Link Supplied!');
    }
};
var calcMods = function (message) {
    var modNum = 0;

    return modNum;
};
module.exports = {calcPP: calcPP};