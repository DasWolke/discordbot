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
var basicCommands = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.help":
            var reply = `${t('basic.help.intro_2')} ${bot.user.username}, ${t('basic.help.intro')} 
                 \`\`\`!w.help --> ${t('basic.help.help')} 
SUPPORT: 
!w.bug --> ${t('basic.help.bug')}
!w.add --> ${t('basic.help.add')}  
-------------------------------- 
Music: 
!w.voice --> i join the Voice Channel you are currently in (only usable with WolkeBot Role) 
!w.silent --> i leave the Voice Channel i am currently connected to. (only usable with WolkeBot Role) 
!w.play name --> Play a Song/Youtube Video max Length: 1H30M (only usable with WolkeBot Role)
!w.pause --> Pause the Current Song (only usable with WolkeBot Role)
!w.resume --> Resume the pause Song (only usable with WolkeBot Role)
!w.volume 40 --> Sets the Volume of the Bot, Values between 1-200 (only usable with WolkeBot Role)
!w.forever name --> Plays a Song/Youtube Video in repeat until another Song is played/added to the Queue (only usable with WolkeBot Role) 
!w.search name --> Searches for a Song in the Bot Database and shows the 5 best Results 
!w.skip --> Skips the Current Song (only usable with WolkeBot Role) 
!w.voteskip --> Starts a Voteskip for the current Song, more than 50% of the channel have to vote, then it is skipped. 
!w.qa name --> Adds a Song/Youtube Video to the Queue max Length: 1H30M 
!w.qrl --> removes the latest added song out of the queue  
!w.queue --> Shows the current Queue 
!w.np --> Shows the currently playing Song
!w.rq --> Adds a random Song to the Queue max Length: 1H30M 
!w.random --> Plays a Random Song (only usable with WolkeBot Role) 
!w.osu maplink --> download a Osu Map 
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
                "--------------------------------\n" +
                "Other Stuff:\n" +
                "!w.r34 tags --> Searches Rule34 for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
                "!w.kona tags --> Searches Konachan for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
                "!w.e621 tags --> Searches E621 for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
                "!w.yandere tags --> Searches Yande.re for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
                "!w.level --> Your Level and XP needed for next Level\n" +
                "!w.rank --> Leaderboard for this Server\n" +
                "!w.noLevel --> disables the level system for you. Use again to enable it again for you.\n" +
                "!w.noPm --> disables the PM notifications for you. Use again to enable it again for you.\n" +
                "!w.pp beatmaplink acc --> Calculates PP for the beatmap with acc, currently nomod only...\n" +
                "!w.setLewd --> Adds the current Channel as a NSFW Channel\n" +
                "!w.remLewd --> Removes the current channel from the list of NSFW channels\n" +
                "!w.cookie @user --> Gives a cookie to the mentioned user or shows your cookies if no one is mentioned. (giving cookies is only usable with WolkeBot role)\n" +
                "!w.eatCookie --> Eats a Cookie.\n" +
                "!w.git --> Gives you the github link of the bot\n" +
                "For feedback use the support discord please ^^\n" +
                "If you want to talk with me @mention me with a message :D```";
            message.author.sendMessage(reply).then(replyMessage => {
                message.author.sendMessage(reply2);
            }).catch(winston.warn);
            if (message.guild) {
                message.reply('OK, i send you a list of commands over PM.');
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
        case "!w.stats":
            let users = 0;
            bot.guilds.map((guild => {
                if (guild.id !== '110373943822540800') {
                    users = users + guild.members.size;
                }
            }));
            message.reply(`I am currently used on ${bot.guilds.size} guilds with ${users} users.`);
            return;
        case "!w.noLevel":
            messageHelper.disableLevel(bot, message);
            return;
        case "!w.noPm":
            messageHelper.disablePm(bot, message);
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
        case "!w.uptime":
            let duration = moment.duration(bot.uptime);
            message.reply(`Uptime: **${duration.humanize()}**`);
            return;
        case "!w.rank":
            if (message.guild) {
                message.reply(`You can find the Leaderboard for this Server here: http://bot.ram.moe/l/${message.guild.id}`);
            }
            return;
        case "!w.git":
            message.reply('https://github.com/DasWolke/discordbot');
            return;
        default:
            return;
    }
};
module.exports = basicCommands;