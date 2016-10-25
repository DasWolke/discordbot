/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var MessageCollector = require('discord.js').MessageCollector;
var t = i18nBean.getT();
var cmd = 'help';
var logger = require('../utility/logger');
var winston = logger.getT();
const Table = require("le-table");
var messageHelper = require("../utility/message.js");
var categorieCmd = [];
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
        // if (!message.author.id === config.owner_id) {
        temp = temp.slice(1, 8);
        // }
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
                reply = reply + `${pre}${data[i].cmd} : ${t(`help.${data[i].cmd}`, {lngs: message.lang})}\n`;
            }
            reply = reply + (`\`\`\``);
            message.channel.sendMessage(reply).then(msg => {

            });
        } else {
            return message.reply(t('help.no-cat', {lngs: message.lang}));
        }
    } else {
        let reply = `${t('help.intro_2', {lngs: message.lang})} ${message.botUser.user.username}, ${t('help.intro', {lngs: message.lang})}
\`\`\``;
        let temp = categories;
        // if (!message.author.id === config.owner_id) {
        temp = temp.slice(1, 8);
        // }
        for (let i = 0; i < temp.length; i++) {
            reply = reply + `${i + 1} ${t(`help.${temp[i].name}`, {lngs: message.lang})}\n`
        }
        reply = reply + `${t('generic.cancel', {lngs: message.lang})}`;
        reply = reply + `\`\`\``;
        message.channel.sendMessage(reply).then(msg => {
            msg.prefix = message.prefix;
            msg.lang = message.lang;
            msg.dbServer = message.dbServer;
            input(msg, temp)
        });
    }
    // let i = categories.length-1;
    // while (i--) {
    //     console.log('------------------------------------------------');
    //     console.log(i);
    //     console.log(categories[i].name);
    //     let x = categories[i].commands.length;
    //     while (x--) {
    //         console.log(categories[i].commands[x].cmd);
    //     }
    // }
//     let otherCmd = [
//         `${t('help.feedback', {lngs: message.lang})}`,
//         `${t('help.talk', {lngs: message.lang})}`
//     ];
//     let supportCmd = [
//         `${pre}bug : ${t('help.bug', {lngs: message.lang})}`,
//         `${pre}add : ${t('help.add', {lngs: message.lang})}`
//     ];
//     let musicCmd = [
//         `${pre}voice : ${t('help.voice', {lngs: message.lang})}`,
//         `${pre}leave : ${t('help.silent', {lngs: message.lang})}`,
//         `${pre}play name : ${t('help.play', {lngs: message.lang})}`,
//         `${pre}stream name or [-u] url: ${t('help.stream', {lngs: message.lang})}`,
//         `${pre}pause : ${t('help.pause', {lngs: message.lang})}`,
//         `${pre}resume : ${t('help.resume', {lngs: message.lang})}`,
//         `${pre}volume 40 : ${t('help.volume', {lngs: message.lang})}`,
//         `${pre}forever name : ${t('help.forever', {lngs: message.lang})}`,
//         `${pre}search name : ${t('help.search', {lngs: message.lang})}`,
//         `${pre}fskip : ${t('help.skip', {lngs: message.lang})}`,
//         `${pre}skip : ${t('help.voteskip', {lngs: message.lang})}`,
//         `${pre}qa name : ${t('help.qa', {lngs: message.lang})}`,
//         `${pre}qra number : ${t('help.qra', {lngs: message.lang})}`,
//         `${pre}queue : ${t('help.queue', {lngs: message.lang})}`,
//         `${pre}np : ${t('help.np', {lngs: message.lang})}`,
//         `${pre}rq number: ${t('help.rq', {lngs: message.lang})}`
//     ];
//     let youtubeCmd = [
//         `${pre}yts query : ${t('help.yts', {lngs: message.lang})}`,
//         `${pre}ytq query : ${t('help.ytq', {lngs: message.lang})}`
//     ];
//     let moderationCmd = [
//         `${t('help.mod-info', {lngs: message.lang})}`,
//         `${pre}info: ${t('help.info', {lngs: message.lang})}`,
//         `${pre}ban user : ${t('help.ban', {lngs: message.lang})}`,
//         `${pre}kick user : ${t('help.kick', {lngs: message.lang})}`,
//         `${pre}rm 10 : ${t('help.rm', {lngs: message.lang})}`,
//         `${pre}noLevelServer : ${t('help.noLevelServer', {lngs: message.lang})}`,
//         `${pre}noPmServer : ${t('help.noPmServer', {lngs: message.lang})}`,
//         `${pre}noChServer : ${t('help.noChServer', {lngs: message.lang})}`,
//         `${pre}setLewd : ${t('help.setLewd', {lngs: message.lang})}`,
//         `${pre}remLewd : ${t('help.remLewd', {lngs: message.lang})}`,
//         `${pre}setPrefix : ${t('help.setPrefix', {lngs: message.lang})}`,
//         `${pre}setLang : ${t('help.setLang', {lngs: message.lang, languages: buildLang(message.langList)})}`
//     ];
//     let miscCmd = [
//         `${pre}r34 tags : ${t('help.r34', {lngs: message.lang})}`,
//         `${pre}kona tags : ${t('help.kona', {lngs: message.lang})}`,
//         `${pre}e621 tags : ${t('help.e621', {lngs: message.lang})}`,
//         `${pre}yandere tags : ${t('help.yandere', {lngs: message.lang})}`,
//         `${pre}pp beatmaplink acc mods : ${t('help.pp', {lngs: message.lang})}`,
//         `${pre}cookie user : ${t('help.cookie', {lngs: message.lang})}`,
//         `${pre}eatCookie : ${t('help.eatCookie', {lngs: message.lang})}`,
//         `${pre}git : ${t('help.git', {lngs: message.lang})}`,
//         `${pre}roll number : ${t('help.roll', {lngs: message.lang})}`,
//         `${pre}8ball message : ${t('help.8ball', {lngs: message.lang})}`,
//         `${pre}garfield : ${t('help.garfield', {lngs: message.lang})}`,
//         `${pre}cat : ${t('help.cat', {lngs: message.lang})}`,
//         `${pre}hug : ${t('help.hug', {lngs: message.lang})}`,
//         `${pre}slap : ${t('help.slap', {lngs: message.lang})}`,
//         `${pre}report : ${t('help.report', {lngs: message.lang})}`
//     ];
//     let userCmd = [
//         `${pre}level : ${t('help.level', {lngs: message.lang})}`,
//         `${pre}rank : ${t('help.rank', {lngs: message.lang})}`,
//         `${pre}noLevel : ${t('help.noLevel', {lngs: message.lang})}`,
//         `${pre}noPm : ${t('help.noPm', {lngs: message.lang})}`
//     ];
//     categorieCmd.push(supportCmd, musicCmd, youtubeCmd, moderationCmd, miscCmd, userCmd, otherCmd);
//     if (messageSplit.length > 0) {
//         let number = 0;
//         try {
//             number = parseInt(messageSplit[0]);
//         } catch (e) {
//             return message.reply(t('generic.whole-num'));
//         }
//         if (isNaN(number)) {
//             return message.reply(t('generic.nan'));
//         }
//         if (number < 1) {
//             return message.reply(t('roll.negative', {number: number}));
//         }
//         if (number <= categorieCmd.length) {
//             let data = categorieCmd[number - 1];
//             let reply = `\`\`\``;
//             for (let i = 0; i < data.length; ++i) {
//                 reply = reply + `${data[i]}\n`;
//             }
//             reply = reply + (`\`\`\``);
//             message.channel.sendMessage(reply).then(msg => {
//
//             });
//         }
//     } else {
//         let categories = [t('help.support', {lngs: message.lang}), t('help.music', {lngs: message.lang}), t('help.youtube', {lngs: message.lang}), t('help.mod', {lngs: message.lang}), t('help.other', {lngs: message.lang})];
//         let categoriesTable = [];
//         for (var i = 0; i < categories.length; i++) {
//             let temp = [];
//             temp.push(categories[i]);
//             categoriesTable.push(temp);
//         }
//         // let data =[[t('help.support', {lngs: message.lang})], [`${pre}bug : ${t('help.bug', {lngs: message.lang})}`], [`${pre}add : ${t('help.add', {lngs: message.lang})}`]];
//         // data.push(support);
//         var myTable = new Table({noAnsi: true});
//         for (let i = 0; i < categoriesTable.length; ++i) {
//             myTable.addRow([i + 1, categoriesTable[i]]);
//         }
//         myTable.addRow([0, t('generic.cancel', {lngs: message.lang})]);
//         var reply = `${t('help.intro_2', {lngs: message.lang})} ${message.botUser.user.username}, ${t('help.intro', {lngs: message.lang})}
// \`\`\`${myTable.stringify()}\`\`\``;
//         message.author.sendMessage(reply).then(msg => {
//             if (message.guild) {
//                 message.reply(t('help.helpReply', {lngs: message.lang}));
//             }
//             input(msg, categories);
//         });
//     }
//     var reply = `${t('help.intro_2', {lngs: message.lang})} ${message.botUser.user.username}, ${t('help.intro',{lngs: message.lang})}
//                  \`\`\`
// ${pre}help : ${t('help.help', {lngs: message.lang})}
// ${t('help.support', {lngs: message.lang})}
// ${pre}bug : ${t('help.bug', {lngs: message.lang})}
// ${pre}add : ${t('help.add', {lngs: message.lang})}
// --------------------------------
// ${t('help.music', {lngs: message.lang})}
// ${pre}voice : ${t('help.voice', {lngs: message.lang})}
// ${pre}leave : ${t('help.silent', {lngs: message.lang})}
// ${pre}play name : ${t('help.play', {lngs: message.lang})}
// ${pre}stream name or [-u] url: ${t('help.stream', {lngs: message.lang})}
// ${pre}pause : ${t('help.pause', {lngs: message.lang})}
// ${pre}resume : ${t('help.resume', {lngs: message.lang})}
// ${pre}volume 40 : ${t('help.volume', {lngs: message.lang})}
// ${pre}forever name : ${t('help.forever', {lngs: message.lang})}
// ${pre}search name : ${t('help.search', {lngs: message.lang})}
// ${pre}fskip : ${t('help.skip', {lngs: message.lang})}
// ${pre}skip : ${t('help.voteskip', {lngs: message.lang})}
// ${pre}qa name : ${t('help.qa', {lngs: message.lang})}
// ${pre}qra number : ${t('help.qra', {lngs: message.lang})}
// ${pre}queue : ${t('help.queue', {lngs: message.lang})}
// ${pre}np : ${t('help.np', {lngs: message.lang})}
// ${pre}rq number: ${t('help.rq', {lngs: message.lang})}
// --------------------------------\`\`\``;
//     var reply2 = `\`\`\`
// ${t('help.youtube', {lngs: message.lang})}
// ${pre}yts query : ${t('help.yts', {lngs: message.lang})}
// ${pre}ytq query : ${t('help.ytq', {lngs: message.lang})}
// --------------------------------
// ${t('help.mod',{lngs: message.lang})}:
// ${t('help.mod-info',{lngs: message.lang})}
// ${pre}info: ${t('help.info', {lngs: message.lang})}
// ${pre}ban user : ${t('help.ban', {lngs: message.lang})}
// ${pre}kick user : ${t('help.kick', {lngs: message.lang})}
// ${pre}rm 10 : ${t('help.rm', {lngs: message.lang})}
// ${pre}noLevelServer : ${t('help.noLevelServer', {lngs: message.lang})}
// ${pre}noPmServer : ${t('help.noPmServer', {lngs: message.lang})}
// ${pre}noChServer : ${t('help.noChServer', {lngs: message.lang})}
// ${pre}setLewd : ${t('help.setLewd', {lngs: message.lang})}
// ${pre}remLewd : ${t('help.remLewd', {lngs: message.lang})}
// ${pre}setPrefix : ${t('help.setPrefix', {lngs: message.lang})}
// --------------------------------\`\`\``;
//     var reply3 =
//         `\`\`\`
// ${t('help.other', {lngs: message.lang})}
// ${pre}r34 tags : ${t('help.r34', {lngs: message.lang})}
// ${pre}kona tags : ${t('help.kona', {lngs: message.lang})}
// ${pre}e621 tags : ${t('help.e621', {lngs: message.lang})}
// ${pre}yandere tags : ${t('help.yandere', {lngs: message.lang})}
// ${pre}level : ${t('help.level', {lngs: message.lang})}
// ${pre}rank : ${t('help.rank', {lngs: message.lang})}
// ${pre}noLevel : ${t('help.noLevel', {lngs: message.lang})}
// ${pre}noPm : ${t('help.noPm', {lngs: message.lang})}
// ${pre}pp beatmaplink acc mods : ${t('help.pp', {lngs: message.lang})}
// ${pre}cookie user : ${t('help.cookie', {lngs: message.lang})}
// ${pre}eatCookie : ${t('help.eatCookie', {lngs: message.lang})}
// ${pre}git : ${t('help.git', {lngs: message.lang})}
// ${pre}roll number : ${t('help.roll', {lngs: message.lang})}
// ${pre}8ball message : ${t('help.8ball', {lngs: message.lang})}
// ${pre}garfield : ${t('help.garfield', {lngs: message.lang})}
// ${pre}cat : ${t('help.cat', {lngs: message.lang})}
// ${pre}hug : ${t('help.hug', {lngs: message.lang})}
// ${pre}slap : ${t('help.slap', {lngs: message.lang})}
// ${pre}report : ${t('help.report', {lngs: message.lang})}
// ${pre}setLang : ${t('help.setLang', {lngs: message.lang, languages:buildLang(message.langList)})}
// ${t('help.feedback',{lngs: message.lang})}
// ${t('help.talk',{lngs: message.lang})}\`\`\``;
    // message.author.sendMessage(reply).then(replyMessage => {
    //     message.author.sendMessage(reply2).then(message2 => {
    //         message.author.sendMessage(reply3).catch(winston.warn);
    //     }).catch(winston.warn);
    // }).catch(winston.warn);
    // if (message.guild) {
    //     message.reply(t('help.helpReply',{lngs: message.lang}));
    // }
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
        if (message.content.startsWith(message.prefix)) {
            collector.stop();
        }
        if (message.content === 'c') {
            collector.stop();
        }
        if (!isNaN(number) && number <= Categories.length) {
            collector.stop();
            let data = Categories[number - 1].commands;
            let reply = `${t(`help.${Categories[number - 1].name}`, {lngs: message.lang})}\n`;
            reply = reply + `\`\`\``;
            for (let i = 0; i < data.length; ++i) {
                reply = reply + `${message.prefix}${data[i].cmd} : ${t(`help.${data[i].cmd}`, {lngs: message.lang})}\n`;
            }
            reply = reply + (`\`\`\``);
            message.channel.sendMessage(reply).then(msg => {

            });
        }
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'support'};