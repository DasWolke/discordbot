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
            if (User.levelEnabled) {
                User.updateXP(function (err) {
                    if (err) return cb(err);
                    if (User.xp + 2 > User.level * 2 * 10) {
                        User.updateLevel(function (err) {
                            if (err) return cb(err);
                            bot.sendMessage(User.id, 'You just reached Level ' + parseInt(User.level + 1));
                        });
                    }
                });
            }
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
            if (User.levelEnabled) {
                bot.reply(message, 'You are Level ' + User.level + ' XP: ' + parseInt(User.xp) + 'XP/' + parseInt(User.level * 2 * 10) + 'XP');
            } else {
                bot.reply(message, 'You disabled Xp for yourself.');
            }
        } else {
            var freshUser = new userModel({
                id: message.author.id,
                name: message.author.username,
                level: 1,
                levelEnabled: true,
                xp: 2,
                avatar: message.author.avatarURL,
                created: Date.now(),
                banned: false
            });
            freshUser.save(function (err) {
                if (err) return cb(err);
            });
            bot.reply(message, 'You are Level ' + 1 + ' XP: ' + parseInt(2) + 'XP/' + parseInt(2 * 10) + 'XP');
        }
    });
};
var disableLevel = function disableLevel(bot, message) {
    userModel.findOne({id: message.author.id}, function (err, User) {
        if (err) return cb(err);
        if (User) {
            if (User.levelEnabled) {
                User.disableLevel(function (err) {
                    if (err) return console.log(err);
                    bot.reply(message, 'Ok, i disabled the XP System for you.');
                });
            } else {
                User.enableLevel(function (err) {
                    if (err) return console.log(err);
                    bot.reply(message, 'Ok, i enabled the XP System for you.');
                });
            }
        } else {
            var freshUser = new userModel({
                id: message.author.id,
                name: message.author.username,
                level: 1,
                levelEnabled: false,
                xp: 0,
                avatar: message.author.avatarURL,
                created: Date.now(),
                banned: false
            });
            freshUser.save(function (err) {
                if (err) return console.log(err);
                bot.reply(message, 'Ok, i disabled the XP System for you.');
            });
        }
    });
};
module.exports = {cleanMessage: cleanMessage, updateXP: updateXp, getLevel: getLevel, disableLevel: disableLevel};