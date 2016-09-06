/**
 * Created by julia on 05.09.2016.
 */
var proxer = function proxerCommands(bot, message) {
    var messageSplit = message.content.split(' ');
    var userModel = require('../../DB/user');
    var messageHelper = require('../utility/message');
    var verifyUser = require('../utility/proxer/verifyUser');
    var proxerReg = /(?:http|https):\/\/proxer\.me\/user\/([0-9]+)/i;
    var proxerId;
    switch (messageSplit[0]) {
        case "!w.pr.register":
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
                                message.reply(`You are already verified with the Account: http://proxer.me/user/${User.proxerId}`);
                            } else {
                                verifyUser(message.author.id, proxerId);
                            }
                        } else {
                            messageHelper.createUser(message, true, true, function (err) {
                                userModel.findOne({id: message.author.id}, function (err, User) {
                                    if (err) return console.log(err);
                                    if (User) {
                                        verifyUser(message.author.id, proxerId);
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
            return;
        default:
            return;
    }
};
module.exports = proxer;