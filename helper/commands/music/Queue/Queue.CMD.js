/**
 * Created by julian on 16.05.2016.
 */
var show = require('./show');
var add = require('./add');
var remove = require('./remove');
var now = require('../Song/now');
var QueueCmd = function QueueCmd(bot,message,messageSplit) {
    if (message.guild) {
        if (typeof (messageSplit[1]) !== 'undefined') {
            if (messageSplit[1] === 'add') {
                add(bot,message,messageSplit);
            }
            if (messageSplit[1] === 'remove') {
                var admin = false;
                for (var role of message.server.rolesOfUser(message.author)) {
                    if (role.name === 'WolkeBot') {
                        admin = true;
                    }
                    if (role.name === 'Proxerteam') {
                        admin = true;
                    }
                }
                if (message.guild.id === '118689714319392769' && admin || message.guild.id === "166242205038673920" && admin || message.guild.id !== "166242205038673920" && message.guild.id !== '118689714319392769') {
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