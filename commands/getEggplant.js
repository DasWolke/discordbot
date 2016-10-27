/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'eggplant';
var execute = function (message) {
    message.channel.sendMessage(":eggplant: ");
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'eastereggs'};