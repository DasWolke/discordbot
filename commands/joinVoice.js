/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'voice';
var execute = function (message) {
    if (message.guild && message.member.voiceChannel) {
        if (messageHelper.hasWolkeBot(message)) {
            message.member.voiceChannel.join().then(connection => {
                message.channel.sendMessage(`Ok, joining your voice channel now ${message.author}`);
                voice.saveVoice(message.member.voiceChannel).then(() => {
                    winston.info(`Saved Voice of Guild ${message.guild.name}`);
                }).catch(winston.warn);
                voice.startQueue(message);
            }).catch(err => {
                winston.warn(err);
                message.reply('An Error has occured while trying to join Voice!')
            });
        } else {
            message.reply('No Permission! You need to give yourself the WolkeBot Role to use this.');
        }
    } else {
        message.reply("You are not in a Voice Channel!");
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};