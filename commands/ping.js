/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'ping';
var execute = function (message) {
    var start = Date.now();
    message.channel.sendMessage("pong").then(sendedMessage => {
        var stop = Date.now();
        var diff = (stop - start);
        sendedMessage.edit(`pong \`${diff}ms\``);
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};