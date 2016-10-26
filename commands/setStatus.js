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
        if (content !== '') {
            message.botUser.user.setStatus('online').then().catch(winston.info);
            message.botUser.user.setGame(content, 'https://www.twitch.tv/daswolke_').then().catch(winston.info);
        } else {
            message.botUser.user.setGame(`!w.help | shard ${parseInt(message.shard_id) + 1}/${message.shard_count}`, 'https://www.twitch.tv/daswolke_').then().catch(winston.info).then(() => {
                message.reply(`Reset status back to \`!w.help | bot.ram.moe\``);
            }).catch(err => {
                winston.error(err)
            });
        }
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'admin'};