/**
 * Created by julian on 16.05.2016.
 */
var show = require('./show');
var add = require('./add');
var remove = require('./remove');
var now = require('../Song/now');
var messageHelper = require('../../../utility/message');
var QueueCmd = function QueueCmd(bot,message,messageSplit) {
    if (message.guild) {
        let admin = messageHelper.hasWolkeBot(bot,message);
        if (typeof (messageSplit[1]) !== 'undefined') {
            if (messageSplit[1] === 'add') {
                add(bot,message,messageSplit);
            }
            if (messageSplit[1] === 'remove') {
                if (admin) {
                    remove(bot, message, messageSplit);
                } else {
                    message.reply('No Permission!');
                }
            }
            if (messageSplit[1] === 'np') {
                now(bot,message);
            }
        } else {
            show(bot,message);
        }
    } else {
        message.reply('This Command does not work in private Channels');
    }
};
module.exports = {main:QueueCmd, add:add, remove:remove,now:now};