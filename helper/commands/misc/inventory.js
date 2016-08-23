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
        if (admin) {
            if (message.mentions.length === 1) {
                var user = message.mentions[0];
                userModel.findOne({id: user.id}, function (err, User) {
                    if (err) return console.log(err);
                    if (User) {
                        if (typeof (User.cookies) !== 'undefined') {
                            userModel.update({id: User.id}, {$set: {cookies: User.cookies + 1}}, function (err) {
                                if (err) return console.log(err);
                                bot.reply(message, `Gave user ${User.name} 1 Cookie!`);
                            });
                        } else {
                            userModel.update({id: User.id}, {$set: {cookies: 1}}, function (err) {
                                if (err) return console.log(err);
                                bot.reply(message, `Gave user ${User.name} 1 Cookie!`);
                            });
                        }
                    } else {
                        messageHelper.createUser(message, true, true, function (err) {
                            if (err) return console.log(err);
                            userModel.findOne({id: user.id}, function (err, User) {
                                if (err) return console.log(err);
                                if (User) {
                                    if (typeof (User.cookies) !== 'undefined') {
                                        userModel.update({id: User.id}, {$set: {cookies: User.cookies + 1}}, function (err) {
                                            if (err) return console.log(err);
                                            bot.reply(message, `Gave user ${User.name} 1 Cookie!`);
                                        });
                                    } else {
                                        userModel.update({id: User.id}, {$set: {cookies: 1}}, function (err) {
                                            if (err) return console.log(err);
                                            bot.reply(message, `Gave user ${User.name} 1 Cookie!`);
                                        });
                                    }
                                } else {
                                    bot.reply(message, "Arere... something went wrong...");
                                }
                            });
                        });
                    }
                });
            } else {
                bot.reply(message,'Please mention **1 User**, not more, not less!');
            }
        } else {
            bot.reply(message, 'You need the Administrator Permission to give cookies!');
        }
    } else {
        userModel.findOne({id:message.author.id}, function (err,User) {
            if (err) return console.log(err);
            if (User) {
                if (typeof (User.cookies) !== 'undefined') {
                    bot.reply(message,`You have **${User.cookies} Cookie(s)** right now.`);
                } else {
                    bot.reply(message, "You have **0 Cookies** right now.")
                }
            } else {
                messageHelper.createUser(message,true,true, function (err) {
                   if (err) return console.log(err);
                });
                bot.reply(message,"You have **0 Cookies** right now.");
            }
        });
    }

};
module.exports = inventoryCmd;