/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var MessageCollector = require('discord.js').MessageCollector;
var t = i18nBean.getT();
var cmd = 'help';
var logger = require('../utility/logger');
var winston = logger.getT();
var messageHelper = require("../utility/message.js");
var cmdManager = require('../utility/cmdManager');
var commands = cmdManager.getCommands();
var config = require('../config/main.json');
var execute = function (message) {
    let categories = [];
    let messageSplit = message.content.split(' ').slice(1);
    let pre = message.prefix;
    for (var command in commands) {
        if (commands.hasOwnProperty(command)) {
            var cmd = commands[command];
            if (checkCat(cmd.cat, categories)) {
                categories = pushCat(cmd, categories);
            } else {
                categories.push({name: cmd.cat, commands: [cmd]});
            }
        }
    }
    if (messageSplit.length > 0) {
        let temp = categories;
        if (message.author.id !== config.owner_id) {
            temp = temp.slice(1, 8);
        }
        let number = 0;
        try {
            number = parseInt(messageSplit[0]);
        } catch (e) {
            return message.reply(t('generic.whole-num', {lngs: message.lang}));
        }
        if (isNaN(number)) {
            return message.reply(t('generic.nan', {lngs: message.lang}));
        }
        if (number < 1) {
            return message.reply(t('help.no-cat', {lngs: message.lang}));
        }
        if (number <= temp.length) {
            let data = temp[number - 1].commands;
            let reply = `${t(`help.${temp[number - 1].name}`, {lngs: message.lang})}\n`;
            reply = reply + `\`\`\``;
            for (let i = 0; i < data.length; ++i) {
                reply = reply + `${'!w.'}${data[i].cmd} : ${t(`help.${data[i].cmd}`, {
                        lngs: message.lang,
                        languages: buildLang(message.langList)
                    })}\n`;
            }
            if (temp[number - 1].name === 'moderation') {
                reply = reply + `${message.prefix}s gr : ${t(`help.gr`, {
                        lngs: message.lang,
                        interpolation: {prefix: '45a45sd'}
                    })}\n`;
                reply = reply + `${message.prefix}s fw : ${t(`help.fw`, {
                        lngs: message.lang,
                        interpolation: {prefix: '45a45sd'}
                    })}`;
            }
            reply = reply + (`\`\`\``);
            message.author.sendMessage(reply).then(msg => {

            });
        } else {
            return message.reply(t('help.no-cat', {lngs: message.lang}));
        }
    } else {
        let reply = `${t('help.intro_2', {lngs: message.lang})} ${message.botUser.user.username}, ${t('help.intro', {
            lngs: message.lang,
            pre: "!w."
        })}
\`\`\``;
        let temp = categories;
        if (message.author.id !== config.owner_id) {
            temp = temp.slice(1, 8);
        }
        for (let i = 0; i < temp.length; i++) {
            reply = reply + `${i + 1} ${t(`help.${temp[i].name}`, {lngs: message.lang})}\n`
        }
        reply = reply + `${t('generic.cancel', {lngs: message.lang})}`;
        reply = reply + `\`\`\``;
        message.author.sendMessage(reply).then(msg => {
            if (message.guild) {
                message.reply(t('help.helpReply', {lngs: message.lang, pre: message.prefix}));
            }
            msg.prefix = message.prefix;
            msg.lang = message.lang;
            msg.dbServer = message.dbServer;
            msg.langList = message.langList;
            input(msg, temp)
        });
    }
};
function buildLang(list) {
    let i = list.length;
    let answer = "";
    while (i--) {
        answer = answer + `${list[i]}|`;
    }
    return answer;
}
function checkCat(cat, list) {
    let i = list.length;
    while (i--) {
        if (cat === list[i].name) {
            return true;
        }
    }
    return false;
}
function pushCat(cmd, list) {
    let i = list.length;
    while (i--) {
        if (cmd.cat === list[i].name) {
            list[i].commands.push(cmd);
        }
    }
    return list;
}
var input = function (message, Categories) {
    let collector = new MessageCollector(message.channel, messageHelper.filterSelection, {time: 1000 * 30});
    collector.on('message', (msg) => {
        let number = 10;
        try {
            number = parseInt(msg.content);
        } catch (e) {

        }
        if (msg.content.startsWith(message.prefix)) {
            collector.stop();
        }
        if (msg.content === 'c') {
            collector.stop();
        }
        if (!isNaN(number) && number <= Categories.length) {
            collector.stop();
            let data = Categories[number - 1].commands;
            let reply = `${t(`help.${Categories[number - 1].name}`, {lngs: message.lang})}\n`;
            reply = reply + `\`\`\``;
            for (let i = 0; i < data.length; ++i) {
                reply = reply + `${message.prefix}${data[i].cmd} : ${t(`help.${data[i].cmd}`, {
                        lngs: message.lang,
                        languages: buildLang(message.langList)
                    })}\n`;
            }
            if (Categories[number - 1].name === 'moderation') {
                reply = reply + `${message.prefix}s gr : ${t(`help.gr`, {
                        lngs: message.lang,
                        interpolation: {prefix: '45a45sd'}
                    })}\n`;
                reply = reply + `${message.prefix}s fw : ${t(`help.fw`, {
                        lngs: message.lang,
                        interpolation: {prefix: '45a45sd'}
                    })}`;
            }
            reply = reply + (`\`\`\``);
            message.channel.sendMessage(reply).then(msg => {

            });
        }
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'support'};