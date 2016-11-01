/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'shrug';
var execute = function (message) {
    message.channel.sendMessage("¯\\_(ツ)_/¯");
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};