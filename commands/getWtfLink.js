/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'wtf';
var execute = function (message) {
    message.reply("http://wtf.watchon.io");
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'eastereggs'};