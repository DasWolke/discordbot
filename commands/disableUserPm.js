/**
 * Created by julia on 03.10.2016.
 */
var cmd = 'noPm';
var userModel = require('../DB/user');
var messageHelper = require('../utility/message');
var execute = function (message) {
    if (message.guild) {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return cb(err);
            if (User) {
                if (messageHelper.pmNotifications(message, User)) {
                    User.disablePm(message.guild.id, function (err) {
                        if (err) return console.log(err);
                        message.reply('Ok, i disabled the Pm Notifications on this Server for you.');
                    });
                } else {
                    User.enablePm(message.guild.id, function (err) {
                        if (err) return console.log(err);
                        message.reply('Ok, i enabled the Pm Notifications on this Server for you.');
                    });
                }
            } else {
                messageHelper.createUser(message, true, false, function (err) {
                    if (err) return console.log(err);
                    message.reply('Ok, i disabled the Pm Notifications on this Server for you.');
                });
            }
        });
    } else {
        message.reply('This command only works in guild channels!');
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};