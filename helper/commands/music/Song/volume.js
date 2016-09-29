/**
 * Created by julia on 29.09.2016.
 */
var voice = require('../../../utility/voice');
var messageHelper = require('../../../utility/message');
var setVolume = function (bot,message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(bot, message)) {
            voice.setVolume(bot, message, function (err, response) {
                if (err) return message.reply(err);
                message.reply(response);
            });
        } else {
            message.reply('No Permission! You need to give yourself the WolkeBot Role to use this.');
        }
    } else {
        message.reply('This Command does not work in private Channels');
    }
};
module.exports = setVolume;