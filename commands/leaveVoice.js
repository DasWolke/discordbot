/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'leave';
var execute = function (message) {
    if (message.guild) {
        if (voice.inVoice(message)) {
            var channel = voice.getVoiceChannel(message);
            if (messageHelper.hasWolkeBot(message)) {
                channel.leave();
                voice.clearVoice(message, function (err) {
                    if (err) return winston.warn(err);
                    message.reply('Ok i left the voice channel.');
                });
            } else {
                message.reply('No Permission! You need to give yourself the WolkeBot Role to use this.');
            }
        } else {
            message.reply('I am not connected to any Voice Channels on this Server!');
        }
    } else {
        message.reply('This Command does not work in private Channels');
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};