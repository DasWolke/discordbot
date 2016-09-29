/**
 * Created by julian on 16.05.2016.
 */
var config = require('../../config/main.json');
var path = require('path');
var voice = require('../utility/voice');
var messageHelper = require('../utility/message');
var cookie = require('./misc/cookie');
var eatCookie = require('./misc/eatCookie');
var moment = require('moment');
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var logger = require('../utility/logger');
var winston = logger.getT();
var AsciiTable = require('ascii-table');
var basicCommands = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.help":
            var reply = `${t('basic.help.intro_2')} ${bot.user.username}, ${t('basic.help.intro')} 
                 \`\`\`!w.help --> ${t('basic.help.help')} 
${t('basic.help.support')}: 
!w.bug --> ${t('basic.help.bug')}
!w.add --> ${t('basic.help.add')}  
-------------------------------- 
${t('basic.help.music')}: 
!w.voice --> ${t('basic.help.voice')} 
!w.silent --> ${t('basic.help.silent')}
!w.play name --> ${t('basic.help.play')}
!w.pause --> ${t('basic.help.pause')}
!w.resume --> ${t('basic.help.resume')}
!w.volume 40 --> ${t('basic.help.volume')}
!w.forever name --> ${t('basic.help.forever')}
!w.search name --> ${t('basic.help.search')}
!w.skip --> ${t('basic.help.skip')}
!w.voteskip --> ${t('basic.help.voteskip')}
!w.qa name --> ${t('basic.help.qa')}
!w.qrl --> ${t('basic.help.qrl')}
!w.qra number --> ${t('basic.help.qra')}
!w.queue --> ${t('basic.help.queue')}
!w.np --> ${t('basic.help.np')}
!w.rq --> ${t('basic.help.rq')}
!w.random --> ${t('basic.help.random')}
!w.osu maplink --> ${t('basic.help.osu')}
--------------------------------\`\`\``;
            var reply2 =
                "```" +
                "Youtube:\n" +
                "!w.yts query --> Searches Youtube and gives you the First Result\n" +
                "!w.ytq query --> Searches Youtube and adds the First Result to the Queue\n" +
                "--------------------------------\n" +
                "Moderation\n" +
                "These Commands all require that the user has a Discord Role named WolkeBot\n" +
                "!w.ban @user --> Bans a User and deletes 7 Days of his/her messages\n" +
                "!w.kick @user --> Kicks a User\n" +
                "!w.rm 10 --> removes the last 10 Messages, you can change 10 to a value between 1-100\n" +
                "!w.noLevelServer --> disables the level system for the whole server, already gained levels are preserved. Use again to enable it again for the server.\n" +
                "!w.noPmServer --> disables the PM notifications for the whole server. Use again to enable it again for the server.\n" +
                "!w.setLewd --> Adds the current Channel as a NSFW Channel\n" +
                "!w.remLewd --> Removes the current channel from the list of NSFW channels\n" +
                "--------------------------------```";
            var reply3 =
                "```Other Stuff:\n" +
                "!w.r34 tags --> Searches Rule34 for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
                "!w.kona tags --> Searches Konachan for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
                "!w.e621 tags --> Searches E621 for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
                "!w.yandere tags --> Searches Yande.re for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
                "!w.level --> Your Level and XP needed for next Level\n" +
                "!w.rank --> Leaderboard for this Server\n" +
                "!w.noLevel --> disables the level system for you. Use again to enable it again for you.\n" +
                "!w.noPm --> disables the PM notifications for you. Use again to enable it again for you.\n" +
                "!w.pp beatmaplink acc mods --> Calculates PP for the beatmap with optional accuracy\n" +
                "!w.cookie @user --> Gives a cookie to the mentioned user or shows your cookies if no one is mentioned. (giving cookies is only usable with WolkeBot role)\n" +
                "!w.eatCookie --> Eats a Cookie.\n" +
                "!w.git --> Gives you the github link of the bot\n" +
                "For feedback use the support discord please ^^\n" +
                "If you want to talk with me @mention me with a message :D```";
            message.author.sendMessage(reply).then(replyMessage => {
                message.author.sendMessage(reply2).then(message2 => {
                    message.author.sendMessage(reply3);
                });
            }).catch(winston.warn);
            if (message.guild) {
                message.reply(t('basic.help.helpReply'));
            }
            return;
        case "!w.version":
            message.reply(t('basic.version', {version:config.version}));
            return;
        case "!w.add":
            message.reply(t('basic.add', {link:`\<https://discordapp.com/oauth2/authorize?client_id=${config.client_id}&scope=bot&permissions=66321471\>`, interpolation: {escape: false}}));
            return;
        case "!w.bug":
            message.reply(t('basic.bug', {link:'https://discord.gg/yuTxmYn', interpolation: {escape: false}}));
            return;
        case "!w.level":
            messageHelper.getLevel(bot, message, function (err) {
                if (err) return winston.warn(err);
            });
            return;
        case "!w.voice":
            if (message.guild && message.member.voiceChannel) {
                if (messageHelper.hasWolkeBot(bot, message)) {
                    message.member.voiceChannel.join().then(connection => {
                        voice.saveVoice(message.member.voiceChannel, function (err) {
                            if (err) return winston.warn(err);
                            winston.info(`Saved Voice of Guild ${message.guild.name}`);
                        });
                        voice.startQueue(bot, message);
                    }).catch(err => {
                        winston.warn(err);
                        message.reply('An Error has occured while trying to join Voice!')
                    });
                } else {
                    message.reply('No Permission! You need to give yourself the WolkeBot Role to use this.');
                }
            } else {
                message.reply("You are not in a Voice Channel!");
            }
            return;
        case "!w.silent":
            if (message.guild) {
                if (voice.inVoice(bot, message)) {
                    var channel = voice.getVoiceChannel(bot, message);
                    if (messageHelper.hasWolkeBot(bot, message)) {
                        channel.leave();
                        voice.clearVoice(message, function (err) {
                            if (err) return winston.warn(err);
                        });
                    } else {
                        message.reply('No Permission! You need to give yourself the WolkeBot Role to use this.');
                    }
                } else {
                    message.reply('I am not connected to any Voice Channels on this Server!');
                }
            } else {
                message.reply('This Command does not work in private Channels');
            }
            return;
        case "!w.wtf":
            message.reply("http://wtf.watchon.io");
            return;
        case "!w.noLevel":
            messageHelper.disableLevel(bot, message);
            return;
        case "!w.noPm":
            messageHelper.disablePm(bot, message);
            return;
        case "!w.noLevelServer":
            messageHelper.disableLevelServer(bot,message);
            return;
        case "!w.noPmServer":
            messageHelper.disablePmServer(bot,message);
            return;
        case "!w.cookie":
            if (message.guild) {
                cookie(bot, message, messageSplit);
            }
            return;
        case "!w.eatCookie":
            if (message.guild) {
                eatCookie(bot, message);
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
        case "!w.info":
            if (message.guild) {
                let table = new AsciiTable();

                table
                    .addRow('ID', message.guild.id)
                    .addRow('Name', message.guild.name)
                    .addRow('Members', message.guild.members.size)
                    .addRow('Creation Date', message.guild.creationDate.toDateString())
                    .addRow('Region', message.guild.region)
                    .addRow('Owner', message.guild.owner.user.username);
                message.reply(`\`\`\`${table.toString()}\`\`\``);
            }
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
                message.reply(`\`\`\`${table.toString()}\`\`\``);
            }
            return;
        default:
            return;
    }
};
module.exports = basicCommands;