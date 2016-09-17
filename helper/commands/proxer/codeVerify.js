/**
 * Created by julia on 17.09.2016.
 */
var userModel = require('../../../DB/user');
var messageHelper = require('../../utility/message');
var verifyCode = function (message,messageSplit) {
    if (typeof (messageSplit[1]) !== 'undefined') {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return console.log(err);
            if (User) {
                if (typeof (User.verified) !== 'undefined' && User.verified) {
                    message.reply(`You are already verified with the Account: https://proxer.me/user/${User.proxerId}`);
                } else {
                    if (typeof (User.verificationToken) !== 'undefined') {
                        if (messageSplit[1] === User.verificationToken) {
                            userModel.update({id: User.id}, {$set: {verified: true}}, (err) => {
                                if (err) return console.log(err);
                                message.reply(`Ok i successfully verified you.`);
                            });
                        } else {
                            return message.reply(`This Token is wrong.`)
                        }
                    } else {
                        return message.reply(`Send yourself a Token first with !w.pr.reg proxer-profilelink`);
                    }
                }
            } else {
                messageHelper.createUser(message, true, true, function (err) {
                    userModel.findOne({id: message.author.id}, function (err, User) {
                        if (err) return console.log(err);
                        if (User) {
                            if (typeof (User.verified) !== 'undefined' && User.verified) {
                                message.reply(`You are already verified with the Account: https://proxer.me/user/${User.proxerId}`);
                            } else {
                                if (typeof (User.verificationToken) !== 'undefined') {
                                    if (messageSplit[1] === User.verificationToken) {
                                        userModel.update({id: User.id}, {$set: {verified: true}}, (err) => {
                                            if (err) return console.log(err);
                                            message.reply(`Ok i successfully verified you.`);
                                        });
                                    } else {
                                        return message.reply(`This Token is wrong.`)
                                    }
                                } else {
                                    return message.reply(`Send yourself a Token first with !w.pr.reg proxer-profilelink`);
                                }
                            }
                        } else {
                            message.reply('Arere Something went wrong...');
                        }
                    });
                });
            }
        });
    } else {
        message.reply('You have to add a Link to your Proxer Account for me to verify you!');
    }
};
module.exports = verifyCode;