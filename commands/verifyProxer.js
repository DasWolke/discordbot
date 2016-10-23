/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var logger = require('../utility/logger');
var userModel = require('../DB/user');
var winston = logger.getT();
var cmd = 'pr.code';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (typeof (messageSplit[1]) !== 'undefined') {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return winston.info(err);
            if (User) {
                if (typeof (User.verified) !== 'undefined' && User.verified) {
                    message.reply(`You are already verified with the Account: https://proxer.me/user/${User.proxerId}`);
                } else {
                    if (typeof (User.verificationToken) !== 'undefined') {
                        if (messageSplit[1] === User.verificationToken) {
                            userModel.update({id: User.id}, {$set: {verified: true}}, (err) => {
                                if (err) return winston.info(err);
                                message.reply(`Ok i successfully verified you.`);
                            });
                        } else {
                            return message.reply(`This Token is wrong.`)
                        }
                    } else {
                        return message.reply(`Send yourself a Token first with !w.pr.reg link to proxer account page`);
                    }
                }
            } else {
                messageHelper.createUser(message, true, true, function (err) {
                    userModel.findOne({id: message.author.id}, function (err, User) {
                        if (err) return winston.info(err);
                        if (User) {
                            if (typeof (User.verified) !== 'undefined' && User.verified) {
                                message.reply(`You are already verified with the Account: https://proxer.me/user/${User.proxerId}`);
                            } else {
                                if (typeof (User.verificationToken) !== 'undefined') {
                                    if (messageSplit[1] === User.verificationToken) {
                                        userModel.update({id: User.id}, {$set: {verified: true}}, (err) => {
                                            if (err) return winston.info(err);
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
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};