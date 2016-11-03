/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'say';
var execute = function (message) {
    let content = message.content.substr(message.prefix.length + cmd.length).trim();
    message.channel.sendMessage('\u200B' + content);
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};