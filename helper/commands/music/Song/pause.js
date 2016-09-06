/**
 * Created by julia on 24.07.2016.
 */
var voice = require('../../../utility/voice');
var messageHelper = require('../../../utility/message');
var pauseCmd = function pauseCmd(bot,message) {
    if (message.guild) {
        var admin = false;
        for (var role of message.server.rolesOfUser(message.author)) {
            if (role.name === 'WolkeBot') {
                admin = true;
            }
            if (role.name === 'Proxerteam') {
                admin = true;
            }
        }
        if (messageHelper.hasWolkeBot(bot,message)) {
            if (voice.inVoice(bot, message)) {
                var connection = voice.getVoiceConnection(bot, message);
                if (!connection.playing) {
                    return message.reply("No Song is playing at the Moment");
                }
                try {
                    connection.pause();
                } catch (e) {
                    message.reply("No Song playing at the Moment!");
                }
            }
            else {
                message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
            }
        }
        else {
            message.reply('No Permission! You need to give yourself the WolkeBot Role to use this.');
        }
    }
    else {
        message.reply("This Commands Only Works in Server Channels!");
    }
};
module.exports = pauseCmd;