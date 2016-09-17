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
                    if (number > 100) {
                        message.reply('You can not delete more than 100 Messages at once!');
                    } else {
                        message.channel.fetchMessages({before: message.id, limit: number}).then(messages => {
                            message.channel.bulkDelete(messages).then(messages => {
                                message.reply(`Successfully deleted ${number} messages`);
                            }).catch(err => {
                                message.reply('Error while trying to delete Messages!');
                                console.log(err);
                            });
                        }).catch(console.log);
                    }
                } else {
                    message.reply('No Number of Messages to delete provided!');
                }
            } else {
                message.reply('You need the WolkeBot Role to use this Command.');
            }
            return;
        case "!w.kick":
            if (message.guild && messageHelper.hasWolkeBot(bot, message)) {
                let user = message.mentions.users.first();
                if (user) {
                    message.guild.fetchMember(user).then(member => {
                        if (member.id !== message.guild.owner.id && !messageHelper.hasWolkeBot(bot, message, member)) {
                            member.kick().then(member => {
                                message.reply(`Kicked User ${member.user.username}`);
                            }).catch(err => {
                                console.log(err);
                                message.reply(`An Error occurred while trying to kick ${member.user.name} !`);
                            });
                        } else {
                            message.reply('You can not kick the Owner or anyone with the WolkeBot Role.');
                        }
                    }).catch(console.log);
                } else {
                    message.reply('Please kick only 1 Person at a time.');
                }
            } else {
                message.reply('No Permission!');
            }
            return;
        case "!w.ban":
            if (message.guild && messageHelper.hasWolkeBot(bot, message)) {
                let user = message.mentions.users.first();
                if (user) {
                    message.guild.fetchMember(user).then(member => {
                        if (member.id !== message.guild.owner.id && !messageHelper.hasWolkeBot(bot, message, member)) {
                            member.ban(7).then(member => {
                                message.reply(`Banned User ${member.user.username}`);
                            }).catch(err => {
                                console.log(err.response);
                                if (err.response.statusCode === 403) {
                                    message.reply(`My Role does not have the Privilege to ban ${member.user.username} !`);
                                } else {
                                    message.reply(`An Error occurred while trying to ban ${member.user.username} !`);
                                }
                            });
                        } else {
                            message.reply('You can not ban the Owner or anyone with the WolkeBot Role.');
                        }
                    }).catch(console.log);
                } else {
                    message.reply('Please mention a User you want to ban.');
                }
            } else {
                message.reply('No Permission!');
            }
            return;
        // case "!w.unban":
        //     if (message.guild && messageHelper.hasWolkeBot(bot, message)) {
        //         var messageSearch;
        //         for (var i = 1; i < messageSplit.length; i++) {
        //             if (i === 1) {
        //                 messageSearch = messageSplit[i];
        //             } else {
        //                 messageSearch = messageSearch + " " + messageSplit[i];
        //             }
        //         }
        //         banModel.findOne({name: messageSearch}, function (err, Ban) {
        //             if (err) {
        //                 message.reply('Could not load Bans..');
        //                 return console.log(err);
        //             }
        //             if (Ban) {
        //                 bot.getBans(message.guild, function (err, Users) {
        //                     if (err) {
        //                         message.reply('Could not load Bans..');
        //                         return console.log(err);
        //                     }
        //                     if (typeof (Users) !== 'undefined' && Users.length > 0) {
        //                         for (var y = 0; y < Users.length; y++) {
        //                             if (Users[y].id === Ban.id) {
        //                                 var User = Users[y];
        //                                 bot.unbanMember(User, message.guild, function (err) {
        //                                     if (err) return message.reply('Error unbanning ' + Ban.name);
        //                                     message.reply('Successfully unbanned ' + Ban.name);
        //                                 });
        //                             }
        //                         }
        //                     } else {
        //                         message.reply('No Bans Found!');
        //                     }
        //                 })
        //             } else {
        //                 message.reply('No Ban Found for that Username!');
        //             }
        //
        //         });
        //     } else {
        //         message.reply('No Permission!');
        //     }
        //     return;
        // case "!w.listban":
        //     if (message.guild && messageHelper.hasWolkeBot(bot, message)) {
        //         banModel.find({guildId: message.guild.id}, function (err, Bans) {
        //             if (err) {
        //                 message.reply('Could not load Bans..');
        //                 return console.log(err);
        //             }
        //             if (typeof (Bans) !== 'undefined' && Bans.length > 0) {
        //                 var reply = "";
        //                 for (var y = 0; y < Bans.length; y++) {
        //                     if (y === 0) {
        //                         reply = `${y + 1}. **Name:** ${Bans[y].name} **Banned By:** ${Bans[y].bannedByName}\n`;
        //                     } else {
        //                         reply = reply + `${y + 1}. **Name:** ${Bans[y].name} **Banned By:** ${Bans[y].bannedByName}\n`;
        //                     }
        //                 }
        //                 message.reply(reply);
        //             } else {
        //                 message.reply('No Bans Found!');
        //             }
        //         });
        //     } else {
        //         message.reply('No Permission!');
        //     }
        //     return;
        default:
            return;
    }
};
module.exports = moderationCMD;