/**
 * Created by julia on 29.09.2016.
 */
var voice = require('../../../../utility/voice');
var messageHelper = require('../../../../utility/message');
var setVolume = function (bot,message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBotmessage)) {
            voice.setVolumemessage).then(response => {
                message.reply(response);
            }).catch(message.reply);
        } else {
            message.reply('No Permission! You need to give yourself the WolkeBot Role to use this.');
        }
    } else {
        message.reply('This Command does not work in private Channels');
    }
};
module.exports = setVolume;