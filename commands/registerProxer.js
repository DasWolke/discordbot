/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var userModel = require('../DB/user');
var verifyUser = require('../utility/proxer/user/verifyUser');
var logger = require('../utility/logger');
var winston = logger.getT();
var proxerReg = /(?:http|https):\/\/proxer\.me\/user\/([0-9]+)/i;
var proxerId;
var cmd = 'pr.reg';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (typeof (messageSplit[1]) !== 'undefined' && proxerReg.test(messageSplit[1])) {
        var match = proxerReg.exec(messageSplit[1]);
        if (match) {
            proxerId = match[1];
        }
        if (proxerId) {
            userModel.findOne({proxerId: proxerId}, function (err, User) {
                if (err) return console.log(err);
                if (User) {
                    return message.reply('The ID is already Used!');
                } else {
                    userModel.findOne({id: message.author.id}, function (err, User) {
                        if (err) return console.log(err);
                        if (User) {
                            if (typeof (User.proxerId) !== 'undefined') {
                                return message.reply('You should already have a Verification Code.');
                            }
                            if (typeof (User.verified) !== 'undefined' && User.verified) {
                                message.reply(`You are already verified with the Account: https://proxer.me/user/${User.proxerId}`);
                            } else {
                                verifyUser(message.author.id, proxerId, function (err, result, name) {
                                    if (err) return console.log(err);
                                    message.reply(`Ok i send your Proxer Account ${name} a PM with a verification Code`);
                                });
                            }
                        } else {
                            messageHelper.createUser(message, true, true, function (err) {
                                userModel.findOne({id: message.author.id}, function (err, User) {
                                    if (err) return console.log(err);
                                    if (User) {
                                        verifyUser(message.author.id, proxerId, function (err, result, name) {
                                            if (err) return console.log(err);
                                            message.reply(`Ok i send your Proxer Account ${name} a PM with a verification Code`);
                                        });
                                    } else {
                                        message.reply('Arere Something went wrong...');
                                    }
                                });
                            });
                        }
                    });
                }
            });
        } else {
            message.reply('I could not read this link....');
        }
    } else {
        message.reply('You have to add a Link to your Proxer Account for me to verify you!');
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};