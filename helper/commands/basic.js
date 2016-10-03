/**
 * Created by julian on 16.05.2016.
 */
var config = require('../../config/main.json');
var path = require('path');
var voice = require('../../utility/voice');
var messageHelper = require('../../utility/message');
var cookie = require('./misc/cookie');
var eatCookie = require('./misc/eatCookie');
var moment = require('moment');
var i18nBean = require('../../utility/i18nManager');
var t = i18nBean.getT();
var logger = require('../../utility/logger');
var winston = logger.getT();
var AsciiTable = require('ascii-table');
var basicCommands = function (bot,message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.bug":
            message.reply(t('basic.bug', {link:'https://discord.gg/yuTxmYn', interpolation: {escape: false}}));
            return;
        case "!w.level":
            messageHelper.getLevel(message, function (err) {
                if (err) return winston.warn(err);
            });
            return;
        case "!w.wtf":
            message.reply("http://wtf.watchon.io");
            return;
        case "!w.noLevel":
            messageHelper.disableLevel(message);
            return;
        case "!w.noPm":
            messageHelper.disablePm(message);
            return;
        case "!w.noLevelServer":
            messageHelper.disableLevelServer(bot,message);
            return;
        case "!w.noPmServer":
            messageHelper.disablePmServer(bot,message);
            return;
        case "!w.cookie":
            if (message.guild) {
                cookie(message, messageSplit);
            }
            return;
        case "!w.eatCookie":
            if (message.guild) {
                eatCookie(message);
            }
            return;
        case "!w.rank":
            if (message.guild) {
                message.reply(`You can find the Leaderboard for this Server here: http://bot.ram.moe/l/${message.guild.id}`);
            }
            return;
        case "!w.git":
            message.reply('https://github.com/DasWolke/discordbot');
            return;
        case "!w.bot":
            if (message.guild) {
                let table = new AsciiTable();
                let duration = moment.duration(bot.uptime);
                let users = 0;
                bot.guilds.map((guild => {
                    if (guild.id !== '110373943822540800') {
                        users = users + guild.members.size;
                    }
                }));
                table
                    .addRow('Uptime', duration.humanize())
                    .addRow('Guilds', bot.guilds.size)
                    .addRow('Users', users);
                message.reply(`\n\`\`\`${table.toString()}\`\`\``);
            }
            return;
        default:
            return;
    }
};
module.exports = basicCommands;