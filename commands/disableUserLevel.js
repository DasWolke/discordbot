/**
 * Created by julia on 03.10.2016.
 */
var cmd = 'noLevel';
var userModel = require('../DB/user');
var messageHelper = require('../utility/message');
var execute = function (message) {
    if (message.guild) {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return cb(err);
            if (User) {
                if (messageHelper.hasGuild(message, User)) {
                    if (messageHelper.levelEnabled(message, User)) {
                        User.disableLevel(message.guild.id, function (err) {
                            if (err) return console.log(err);
                            message.reply('Ok, i disabled the XP System for you.');
                        });
                    } else {
                        User.enableLevel(message.guild.id, function (err) {
                            if (err) return console.log(err);
                            message.reply('Ok, i enabled the XP System for you.');
                        });
                    }
                } else {
                    User.addServer(messageHelper.getServerObj(message, false, false), function (err) {
                        if (err) return console.log(err);
                        message.reply('Ok, i disabled the XP System for you.');
                    });
                }
            } else {
                messageHelper.createUser(message, false, false, function (err) {
                    if (err) return console.log(err);
                    message.reply('Ok, i disabled the XP System for you.');
                });
            }
        });
    } else {
        message.reply('This command only works in guild channels!');
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};