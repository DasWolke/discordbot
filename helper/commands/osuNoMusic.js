/**
 * Created by julia on 18.07.2016.
 */
var osuCommands = function osuCommands(bot, message) {
    var osuHelper = require('../utility/osu');
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.pp":
            osuHelper.calcPP(bot,message);
            return;
        default:
            return;
    }
};
module.exports = osuCommands;