/**
 * Created by julian on 16.05.2016.
 */
var show = require('./show');
var add = require('./add');
var remove = require('./remove');
var QueueCmd = function QueueCmd(bot,message,messageSplit) {
    if (!message.channel.isPrivate) {
        if (typeof (messageSplit[1]) !== 'undefined') {
            if (messageSplit[1] === 'add') {
                add(bot,message,messageSplit);
            }
            if (messageSplit[1] === 'remove') {
                remove(bot,message,messageSplit);
            }
        } else {
            show(bot,message);
        }
    } else {
        bot.reply(message, 'This Command does not work in private Channels');
    }
};
module.exports = QueueCmd;