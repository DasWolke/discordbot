/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'resume';
var voice = require('../utility/voice');
var messageHelper = require('../utility/message');
var execute = function (message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message)) {
            voice.setVolume(message).then(response => {
                message.reply(response);
            }).catch(message.reply);
        } else {
            message.reply('No Permission! You need to give yourself the WolkeBot Role to use this.');
        }
    } else {
        message.reply('This Command does not work in private Channels');
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};