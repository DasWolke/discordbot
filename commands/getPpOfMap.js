/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'pp';
var osuHelper = require('../utility/osu');
var execute = function (message) {
    osuHelper.calcPP(message);
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};