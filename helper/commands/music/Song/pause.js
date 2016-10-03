/**
 * Created by julia on 24.07.2016.
 */
var voice = require('../../../../utility/voice');
var messageHelper = require('../../../../utility/message');
var pauseCmd = function pauseCmd(message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message)) {
            if (voice.inVoice(message)) {
                var connection = voice.getVoiceConnection(message);
                var dispatcher = voice.getDispatcher(connection);
                try {
                    dispatcher.pause();
                } catch (e) {
                    console.log(e);
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