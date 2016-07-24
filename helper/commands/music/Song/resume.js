/**
 * Created by julia on 24.07.2016.
 */
var voice = require('../../../utility/voice');
var resumeCmd = function resumeCmd(bot,message) {
    if (!message.channel.isPrivate) {
        var admin = false;
        for (var role of message.server.rolesOfUser(message.author)) {
            if (role.name === 'WolkeBot') {
                admin = true;
            }
            if (role.name === 'Proxerteam') {
                admin = true;
            }
        }
        if (message.server.id === '118689714319392769' && admin || message.server.id === "166242205038673920" && admin || message.server.id !== "166242205038673920" && message.server.id !== '118689714319392769') {
            if (voice.inVoice(bot, message)) {
                var connection = voice.getVoiceConnection(bot, message);
                if (connection.playing) {
                    return bot.reply(message, "A Song is playing at the Moment!");
                }
                try {
                    connection.resume();
                } catch (e) {
                    bot.reply(message, "No Song playing at the Moment!");
                }
            }
            else {
                bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
            }
        } else {
            bot.reply(message, 'No Permission!');
        }
    } else {
        bot.reply(message, "This Commands Only Works in Server Channels!");
    }
};
module.exports = resumeCmd;