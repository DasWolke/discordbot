/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'kick';
var execute = function (message) {
    if (message.guild && messageHelper.hasWolkeBot(message)) {
        let user = message.mentions.users.first();
        if (user.id !== message.botUser.user.id) {
            if (user) {
                message.guild.fetchMember(user).then(member => {
                    if (member.id !== message.guild.owner.id && !messageHelper.hasWolkeBot(message, member)) {
                        member.kick().then(member => {
                            message.reply(`Kicked User ${member.user.username}`);
                        }).catch(err => {
                            // console.log(err);
                            message.reply(`An Error occurred while trying to kick ${member.user.name} !`);
                        });
                    } else {
                        message.reply('You can not kick the Owner or anyone with the WolkeBot Role.');
                    }
                }).catch(console.log);
            } else {
                message.reply('Please kick only 1 Person at a time.');
            }
        } else {
            message.reply('You can not kick me with my own command.');
        }
    } else {
        message.reply('No Permission!');
    }
};
module.exports = {cmd: cmd, accessLevel: 1, exec: execute};