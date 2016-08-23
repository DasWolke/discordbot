/**
 * Created by julia on 23.08.2016.
 */
var messageHelper = require('../utility/message');
var moderationCMD = function moderationCMD(bot,message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.rm":
            if (!message.channel.isPrivate && messageHelper.hasWolkeBot(bot,message)) {
                if (typeof (messageSplit[1]) !== 'undefined') {
                    var number = 0;
                    try {
                        number = parseInt(messageSplit[1]);
                    } catch (e) {
                        return bot.reply(message, 'Could not parse the Number !');
                    }
                    bot.getChannelLogs(message.channel, number,{before:message}, function (err, Messages) {
                        if (err) return bot.reply(message, 'Error while trying to get Channel Logs!');
                        if (Messages.length > 0) {
                            bot.deleteMessages(Messages, function (err) {
                                if (err) return bot.reply(message, 'Error while trying to delete Messages!');
                                bot.reply(message, `Successfully deleted ${number} messages`);
                            });
                        }
                    });
                } else {
                    bot.reply(message, 'No Number of Messages to delete provided!');
                }
            } else {
                bot.reply(message, 'You need the WolkeBot Role to use this Command.');
            }
            return;
        case "!w.kick":

            return;
        case "!w.ban":
            return;
        case "!w.unban":
            return;
        default:
            return;
    }
};
module.exports = moderationCMD;