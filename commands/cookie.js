/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var userModel = require('../DB/user');
var winston = logger.getT();
var cmd = 'cookie';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (typeof (messageSplit[1]) !== 'undefined') {
        if (messageHelper.hasWolkeBot(message)) {
            let user = message.mentions.users.first();
            if (user) {
                userModel.findOne({id: user.id}, function (err, User) {
                    if (err) return console.log(err);
                    if (User) {
                        if (messageHelper.hasGuild(message, User)) {
                            var clientServer = messageHelper.loadServerFromUser(message, User);
                            if (typeof (clientServer.cookies) !== 'undefined') {
                                userModel.update({
                                    id: User.id,
                                    'servers.serverId': message.guild.id
                                }, {$inc: {'servers.$.cookies': 1}}, function (err) {
                                    if (err) return console.log(err);
                                    message.reply(`Gave user **${User.name}** **1** Cookie!`);
                                });
                            } else {
                                userModel.update({
                                    id: User.id,
                                    'servers.serverId': message.guild.id
                                }, {$inc: {'servers.$.cookies': 1}}, function (err) {
                                    if (err) return console.log(err);
                                    message.reply(`Gave user ${User.name} 1 Cookie!`);
                                });
                            }
                        } else {
                            User.addServer(messageHelper.getServerObj(message, true, true), function (err) {
                                if (err) return console.log(err);
                            });
                        }
                    } else {
                        messageHelper.createUser({author:user, guild:message.guild}, true, true, function (err) {
                            if (err) return console.log(err);
                            userModel.findOne({id: user.id}, function (err, User) {
                                if (err) return console.log(err);
                                if (User) {
                                    var clientServer = messageHelper.loadServerFromUser(message, User);
                                    if (typeof (clientServer.cookies) !== 'undefined') {
                                        userModel.update({
                                            id: User.id,
                                            'servers.serverId': message.guild.id
                                        }, {$inc: {'servers.$.cookies': 1}}, function (err) {
                                            if (err) return console.log(err);
                                            message.reply(`Gave user ${User.name} 1 Cookie!`);
                                        });
                                    } else {
                                        var server = messageHelper.getServerObj(message,true,true);
                                        User.addServer(server, function (err) {
                                            if (err) return console.log(err);
                                            message.reply('Try again please.');
                                        });
                                    }
                                } else {
                                    message.reply("Arere... something went wrong...");
                                }
                            });
                        });
                    }
                });
            } else {
                message.reply('Please mention **1 User**, not more, not less!');
            }
        } else {
            message.reply('You need the WolkeBot role to give cookies!');
        }
    } else {
        userModel.findOne({id: message.author.id, 'servers.serverId': message.guild.id}, function (err, User) {
            if (err) return console.log(err);
            if (User) {
                var clientServer = messageHelper.loadServerFromUser(message, User);
                if (typeof (clientServer.cookies) !== 'undefined') {
                    message.reply(`You have **${clientServer.cookies} Cookie(s)** right now.`);
                } else {
                    message.reply("You have **0 Cookies** right now.")
                }
            } else {
                messageHelper.createUser(message, true, true, function (err) {
                    if (err) return console.log(err);
                });
                message.reply("You have **0 Cookies** right now.");
            }
        });
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};