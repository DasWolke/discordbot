/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'bot';
var moment = require('moment');
var AsciiTable = require('ascii-table');
var Discord = require('discord.js');
var logger = require('../utility/logger');
var winston = logger.getT();
var execute = function (message) {
    let shardUtil = new Discord.ShardClientUtil(message.botUser);
    if (message.guild) {
        let users = 0;
        let channels = 0;
        let voice_s = 0;
        let voice = 0;
        let guilds = 0;
        let table = new AsciiTable();
        let duration = moment.duration(message.botUser.uptime);
        shardUtil.broadcastEval('this.guilds.size').then(res => {
            winston.info(res);
            res = res.reduce((a, b) => a + b);
            guilds = res;
            shardUtil.broadcastEval('var x=0;this.guilds.map(g => {x += g.memberCount});x;').then(res => {
                winston.info(res);
                res = res.reduce((a, b) => a + b);
                users = res;
                shardUtil.broadcastEval('var x=0;this.guilds.map(g => {x += g.channels.size});x;').then(res => {
                    winston.info(res);
                    res = res.reduce((a, b) => a + b);
                    channels = res;
                    shardUtil.broadcastEval('var x=0;this.guilds.map(g => {g.voiceConnection ? x += 1 : x});x;').then(res => {
                        winston.info(res);
                        res = res.reduce((a, b) => a + b);
                        voice = res;
                        let averageUsers = users / guilds;
                        let averageChannels = channels / guilds;
                        var users_s = 0;
                        var channels_s = 0;
                        message.botUser.guilds.map(g => {
                            g.voiceConnection ? voice_s += 1 : voice_s;
                            channels_s += g.channels.size;
                            users_s += g.memberCount;
                        });
                        table
                            .addRow(t('bot-info.uptime', {lngs: message.lang}), duration.humanize())
                            .addRow(t('bot-info.guilds', {lngs: message.lang}), guilds)
                            .addRow(t('bot-info.channels', {lngs: message.lang}), channels)
                            .addRow(t('bot-info.users', {lngs: message.lang}), users)
                            .addRow(t('bot-info.avg-users', {lngs: message.lang}), averageUsers.toFixed(2))
                            .addRow(t('bot-info.avg-channels', {lngs: message.lang}), averageChannels.toFixed(2))
                            .addRow(t('bot-info.guilds-s', {lngs: message.lang}), message.botUser.guilds.size)
                            .addRow(t('bot-info.channels-s', {lngs: message.lang}), channels_s)
                            .addRow(t('bot-info.users-s', {lngs: message.lang}), users_s)
                            .addRow(t('bot-info.voice', {lngs: message.lang}), voice_s)
                            .addRow(t('bot-info.voice', {lngs: message.lang}), voice)
                            .addRow(t('bot-info.shard', {lngs: message.lang}), `${parseInt(message.shard_id) + 1}/${message.shard_count}`);
                        message.channel.sendMessage(`\n\`\`\`${table.toString()}\`\`\``);
                    }).catch(winston.error);
                }).catch(winston.error);
            }).catch(winston.error);
        }).catch(winston.error);
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'stats'};