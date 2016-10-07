/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'ban';
var execute = function (message) {
    if (message.guild && messageHelper.hasWolkeBot(message)) {
        let user = message.mentions.users.first();
        if (user) {
            if (user.id !== message.botUser.user.id) {
                message.guild.fetchMember(user).then(member => {
                    if (member.id !== message.guild.owner.id && !messageHelper.hasWolkeBot(message, member)) {
                        member.ban(7).then(member => {
                            message.reply(`Banned User ${member.user.username}`);
                        }).catch(err => {
                            console.log(err.response);
                            if (err.response.statusCode === 403) {
                                message.reply(`My Role does not have the Privilege to ban ${member.user.username} !`);
                            } else {
                                message.reply(`An Error occurred while trying to ban ${member.user.username} !`);
                            }
                        });
                    } else {
                        message.reply('You can not ban the Owner or anyone with the WolkeBot Role.');
                    }
                }).catch(console.log);
            } else {
                message.reply('You can not kick me with my own command.');
            }
        } else {
            message.reply('Please mention a User you want to ban.');
        }
    } else {
        message.reply('No Permission!');
    }
};
module.exports = {cmd:cmd, accessLevel:1, exec:execute};