/**
 * Created by julia on 17.09.2016.
 */
var proxerReg = /(?:http|https):\/\/proxer\.me\/user\/([0-9]+)/i;
var proxerId;
var userModel = require('../../../DB/user');
var messageHelper = require('../../utility/message');
var verifyUser = require('../../utility/proxer/user/verifyUser');
var registerUser = function (message, messageSplit) {
    if (typeof (messageSplit[1]) !== 'undefined' && proxerReg.test(messageSplit[1])) {
        var match = proxerReg.exec(messageSplit[1]);
        if (match) {
            proxerId = match[1];
        }
        if (proxerId) {
            userModel.findOne({id: message.author.id}, function (err, User) {
                if (err) return console.log(err);
                if (User) {
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
        } else {
            message.reply('I could not read this link....');
        }
    } else {
        message.reply('You have to add a Link to your Proxer Account for me to verify you!');
    }
};
module.exports = registerUser;