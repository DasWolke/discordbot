/**
 * Created by julia on 17.08.2016.
 */
var userModel = require('../../../DB/user');
var messageHelper = require('../../utility/message');
var inventoryCmd = function (bot, message, messageSplit) {
    if (typeof (messageSplit[1]) !== 'undefined') {
        var admin = false;
        for (var role of message.server.rolesOfUser(message.author)) {
            if (role.hasPermission('administrator')) {
                admin = true
            }
        }
        if (admin || messageHelper.hasWolkeBot(bot,message)) {
            if (message.mentions.length === 1) {
                var user = message.mentions[0];
                userModel.findOne({id: user.id}, function (err, User) {
                    if (err) return console.log(err);
                    if (User) {
                        if (messageHelper.hasServer(message, User)) {
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
                                userModel.update({
                                    id: User.id,
                                    'servers.serverId': message.guild.id
                                }, {$inc: {'servers.$.cookies': 1}}, function (err) {
                                    if (err) return console.log(err);
                                    message.reply(`Gave user ${User.name} 1 Cookie!`);
                                });
                            }
                        } else {
                            User.addServer(message.getServerObj(message, true, true), function (err) {
                                if (err) return console.log(err);
                            });
                        }
                    } else {
                        messageHelper.createUser({author:user, server:message.server}, true, true, function (err) {
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
            message.reply('You need the Administrator Permission or the WolkeBot role to give cookies!');
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
module.exports = inventoryCmd;