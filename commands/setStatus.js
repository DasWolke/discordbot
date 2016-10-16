/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'setStatus';
var config = require('../config/main.json');
var logger = require('../utility/logger');
var winston = logger.getT();
var execute = function (message) {
    if (message.author.id === config.owner_id) {
        let content = message.content.substr(message.prefix.length + cmd.length).trim();
        message.botUser.user.setStatus('online', content).then(() => {
            message.reply(`Changed status to \`${content}\``);
        }).catch(err => {winston.error(err)});
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};