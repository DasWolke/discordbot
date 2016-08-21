/**
 * Created by julia on 18.07.2016.
 */
var userModel = require('../../DB/user');
var cleanMessage = function (message) {
    return message.replace("@", "");
};
var createUser = function (message,level,pms,cb) {
    var freshUser = new userModel({
        id: message.author.id,
        name: message.author.username,
        level: 1,
        levelEnabled:level,
        pmNotifications:pms,
        xp: 2,
        avatar: message.author.avatarURL,
        created: Date.now(),
        banned: false,
        favorites:[],
        cookies:0
    });
    freshUser.save(function (err) {
        if (err) return cb(err);
    });
};
var calcXpNeeded = function (User) {

};
var updateXp = function (bot, message, cb) {
    if (message.author.equals(bot)) {

    } else {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return cb(err);
            if (User) {
                if (User.levelEnabled) {
                    User.updateXP(function (err) {
                        if (err) return cb(err);
                        if (User.xp + 2 > User.level * 20) {
                            User.updateLevel(function (err) {
                                if (err) return cb(err);
                                if (typeof (User.pmNotifications) === 'undefined' || User.pmNotifications) {
                                    bot.sendMessage(User.id, 'You just reached Level ' + parseInt(User.level + 1));
                                }
                            });
                        }
                    });
                }
            } else {
                createUser(message, true, true, function (err) {
                    if (err) return cb(err);
                    cb()
                });
            }
        });
    }
};
var getLevel = function getLevel(bot, message, cb) {
    userModel.findOne({id: message.author.id}, function (err, User) {
        if (err) return cb(err);
        if (User) {
            if (User.levelEnabled) {
                bot.reply(message, 'You are **Level ' + User.level + '** XP: ' + parseInt(User.xp) + 'XP/' + parseInt(User.level * 2 * 10) + 'XP');
            } else {
                bot.reply(message, 'You disabled Xp for yourself.');
            }
        } else {
            createUser(message,true, true,function (err) {
                if (err) return cb(err);
                cb()
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
            createUser(message,false, false,function (err) {
                if (err) return console.log(err);
                bot.reply(message, 'Ok, i disabled the XP System for you.');
            });
        }
    });
};
var disablePm = function disablePm(bot,message) {
    userModel.findOne({id: message.author.id}, function (err, User) {
        if (err) return cb(err);
        if (User) {
            if (typeof(User.pmNotifications) === 'undefined' || User.pmNotifications) {
                User.disablePm(function (err) {
                    if (err) return console.log(err);
                    bot.reply(message, 'Ok, i disabled the Pm Notifications for you.');
                });
            } else {
                User.enablePm(function (err) {
                    if (err) return console.log(err);
                    bot.reply(message, 'Ok, i enabled the Pm Notifications for you.');
                });
            }
        } else {
            createUser(message,true, false,function (err) {
                if (err) return console.log(err);
                bot.reply(message, 'Ok, i disabled the Pm Notifications for you.');
            });
        }
    });
};
module.exports = {cleanMessage: cleanMessage, createUser:createUser,updateXP: updateXp, getLevel: getLevel, disableLevel: disableLevel, disablePm:disablePm};