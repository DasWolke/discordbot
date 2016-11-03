/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'setStatus';
var config = require('../config/main.json');
var logger = require('../utility/logger');
var winston = logger.getT();
var Discord = require('discord.js');
var execute = function (message) {
    if (message.author.id === config.owner_id) {
        let shardUtil = new Discord.ShardClientUtil(message.botUser);
        let content = message.content.substr(message.prefix.length + cmd.length).trim();
        let contentSplit = content.split(']');
        let streamUrl = contentSplit.length > 1 ? contentSplit[1] : 'https://www.twitch.tv/daswolke_';
        if (content !== '') {
            winston.info(`this.user.setGame('${contentSplit[0]}', '${streamUrl}')`);
            shardUtil.broadcastEval(`this.user.setGame('${contentSplit[0]}', '${streamUrl}')`).then(res => {
                message.reply(`Set status to \`${contentSplit[0]}\` with url \`${streamUrl}\``);
            }).catch(winston.info);
            // message.botUser.user.setGame(contentSplit[0], streamUrl).then(()=> {
            //
            // }).catch(winston.info);
        } else {
            shardUtil.broadcastEval(`this.user.setGame('!w.help | shard ${parseInt(message.shard_id) + 1}/${message.shard_count}', 'https://www.twitch.tv/daswolke_')`).then(res => {
                message.reply(`Reset status back to \`!w.help | | shard ${parseInt(message.shard_id) + 1}/${message.shard_count}\``);
            }).catch(winston.info);
            // message.botUser.user.setGame(`!w.help | shard ${parseInt(message.shard_id) + 1}/${message.shard_count}`, 'https://www.twitch.tv/daswolke_').then().catch(winston.info).then(() => {
            //     message.reply(`Reset status back to \`!w.help | | shard ${parseInt(message.shard_id) + 1}/${message.shard_count}\``);
            // }).catch(err => {
            //     winston.error(err)
            // });
        }
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'admin'};