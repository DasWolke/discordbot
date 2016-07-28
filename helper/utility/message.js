/**
 * Created by julia on 18.07.2016.
 */
var userModel = require('../../DB/user');
var cleanMessage = function (message) {
    return message.replace("@", "");
};
var updateXp = function (bot, message, cb) {
    userModel.findOne({id: message.author.id}, function (err, User) {
        if (err) return cb(err);
        if (User) {
            User.updateXP(function (err) {
                if (err) return cb(err);
                if (User.xp + 2 > User.level * 2 * 10) {
                    User.updateLevel(function (err) {
                        if (err) return cb(err);
                        bot.sendMessage(User.id, 'You now have the Level ' + parseInt(User.level + 1));
                    });
                }
            });
        } else {
            var freshUser = new userModel({
                id: message.author.id,
                name: message.author.username,
                level: 1,
                xp: 2,
                avatar: message.author.avatarURL,
                created: Date.now(),
                banned: false
            });
            freshUser.save(function (err) {
                if (err) return cb(err);
            });
        }
    });
};
var getLevel = function getLevel(bot, message, cb) {
    userModel.findOne({id: message.author.id}, function (err, User) {
        if (err) return cb(err);
        if (User) {
            bot.reply(message, 'You are Level ' + User.level);
        } else {
            var freshUser = new userModel({
                id: message.author.id,
                name: message.author.username,
                level: 1,
                xp: 2,
                avatar: message.author.avatarURL,
                created: Date.now(),
                banned: false
            });
            freshUser.save(function (err) {
                if (err) return cb(err);
            });
            bot.reply(message, 'You are Level ' + 1);
        }
    });
};
module.exports = {cleanMessage: cleanMessage, updateXP: updateXp, getLevel: getLevel};