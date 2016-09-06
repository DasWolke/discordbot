/**
 * Created by julia on 23.08.2016.
 */
var messageHelper = require('../utility/message');
var banModel = require('../../DB/ban');
var moderationCMD = function moderationCMD(bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.rm":
            if (message.guild && messageHelper.hasWolkeBot(bot, message)) {
                if (typeof (messageSplit[1]) !== 'undefined') {
                    var number = 0;
                    try {
                        number = parseInt(messageSplit[1]);
                    } catch (e) {
                        return message.reply('Could not parse the Number !');
                    }
                    bot.getChannelLogs(message.channel, number, {before: message}, function (err, Messages) {
                        if (err) return message.reply('Error while trying to get Channel Logs!');
                        if (Messages.length > 0) {
                            bot.deleteMessages(Messages, function (err) {
                                if (err) return message.reply('Error while trying to delete Messages!');
                                message.reply(`Successfully deleted ${number} messages`);
                            });
                        }
                    });
                } else {
                    message.reply('No Number of Messages to delete provided!');
                }
            } else {
                message.reply('You need the WolkeBot Role to use this Command.');
            }
            return;
        case "!w.kick":
            if (message.guild && messageHelper.hasWolkeBot(bot, message)) {
                if (message.mentions.length === 1) {
                    if (message.mentions[0].id !== message.server.owner.id && !messageHelper.hasWolkeBot(bot, message, message.mentions[0])) {
                        bot.kickMember(message.mentions[0], message.server, function (err) {
                            if (err) return message.reply("An Error occurred while trying to kick the User!");
                            message.reply(`Kicked User ${message.mentions[0].name}`);
                        });
                    } else {
                        message.reply('You can not kick the Owner or anyone with the WolkeBot Role.');
                    }
                } else {
                    message.reply('Please kick only 1 Person at a time.');
                }
            } else {
                message.reply('No Permission!');
            }
            return;
        case "!w.ban":
            if (message.guild && messageHelper.hasWolkeBot(bot, message)) {
                if (message.mentions.length === 1) {
                    if (message.mentions[0].id !== message.server.owner.id && !messageHelper.hasWolkeBot(bot, message, message.mentions[0])) {
                        bot.banMember(message.mentions[0], message.server, 7, function (err) {
                            if (err) {
                                console.log(err);
                                return message.reply("An Error occurred while trying to ban the User!");
                            }
                            var ban = new banModel({
                                id: message.mentions[0].id,
                                serverId: message.guild.id,
                                name: message.mentions[0].name,
                                bannedBy:message.author.id,
                                bannedByName:message.author.name
                            });
                            ban.save(function (err) {
                                if (err) return console.log(err);
                            });
                            message.reply(`Banned User ${message.mentions[0].name}`);
                        });
                    } else {
                        message.reply('You can not ban the Owner or anyone with the WolkeBot Role.');
                    }
                } else {
                    message.reply('Please ban only 1 Person at a time.');
                }
            } else {
                message.reply('No Permission!');
            }
            return;
        case "!w.unban":
            if (message.guild && messageHelper.hasWolkeBot(bot, message)) {
                var messageSearch;
                for (var i = 1; i<messageSplit.length;i++) {
                    if (i === 1) {
                        messageSearch = messageSplit[i];
                    } else {
                        messageSearch = messageSearch + " " + messageSplit[i];
                   }
                }
                banModel.findOne({name:messageSearch}, function (err,Ban) {
                   if (err) {
                       message.reply('Could not load Bans..');
                       return console.log(err);
                   }
                    if (Ban) {
                        bot.getBans(message.server, function (err, Users) {
                            if (err) {
                                message.reply('Could not load Bans..');
                                return console.log(err);
                            }
                            if (typeof (Users) !== 'undefined' && Users.length > 0) {
                                for (var y = 0; y < Users.length; y++) {
                                    if (Users[y].id === Ban.id) {
                                        var User = Users[y];
                                        bot.unbanMember(User,message.server, function (err) {
                                            if (err) return message.reply('Error unbanning ' + Ban.name);
                                            message.reply('Successfully unbanned ' + Ban.name);
                                        });
                                    }
                                }
                            } else {
                                message.reply('No Bans Found!');
                            }
                        })
                    } else {
                        message.reply('No Ban Found for that Username!');
                    }

                });
            } else {
                message.reply('No Permission!');
            }
            return;
        case "!w.listban":
            if (message.guild && messageHelper.hasWolkeBot(bot, message)) {
                banModel.find({serverId:message.guild.id}, function (err, Bans) {
                    if (err) {
                        message.reply('Could not load Bans..');
                        return console.log(err);
                    }
                    if (typeof (Bans) !== 'undefined' && Bans.length > 0) {
                        var reply = "";
                        for (var y = 0; y < Bans.length; y++) {
                            if (y === 0) {
                                reply = `${y+1}. **Name:** ${Bans[y].name} **Banned By:** ${Bans[y].bannedByName}\n`;
                            } else {
                                reply = reply + `${y+1}. **Name:** ${Bans[y].name} **Banned By:** ${Bans[y].bannedByName}\n`;
                            }
                        }
                        message.reply(reply);
                    } else {
                        message.reply('No Bans Found!');
                    }
                });
            } else {
                message.reply('No Permission!');
            }
            return;
        default:
            return;
    }
};
module.exports = moderationCMD;