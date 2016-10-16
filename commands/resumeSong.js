/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'resume';
var voice = require('../utility/voice');
var messageHelper = require('../utility/message');
var config = require('../config/main.json')
var execute = function (message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message) || config.beta) {
            if (voice.inVoice(message)) {
                var connection = voice.getVoiceConnection(message);
                var dispatcher = voice.getDispatcher(connection);
                try {
                    dispatcher.resume();
                    message.channel.sendMessage(':arrow_forward: ');
                } catch (e) {
                    message.channel.sendMessage("No Song playing at the Moment!");
                }
            }
            else {
                message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
            }
        } else {
            message.reply('No Permission! You need to give yourself the WolkeBot Role to use this.');
        }
    } else {
        message.reply("This Commands Only Works in Server Channels!");
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};