/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'createInvite';
var config = require('../config/main.json');
var logger = require('../utility/logger');
var winston = logger.getT();
var execute = function (message) {
    if (message.author.id === config.owner_id) {
        let content = message.content.substr(message.prefix.length + cmd.length).trim();
        if (content !== '') {
            let guild = message.botUser.guilds.find('id', content);
            if (guild) {
                guild.defaultChannel.createInvite({maxUses: 1, maxAge: 600}).then(Invite => {
                    message.reply(Invite);
                }).catch(message.reply);
            } else {
                message.reply('Could not fetch guild!');
            }
        } else {
            message.reply('That will not work!');
        }
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'admin'};