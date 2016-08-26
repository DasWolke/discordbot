/**
 * Created by julia on 18.07.2016.
 */
var userModel = require('../../DB/user');
var cleanMessage = function (message) {
    return message.replace("@", "");
};
var createUser = function (message, level, pms, cb) {
    var server = getServerObj(message, level, pms);
    var freshUser = new userModel({
        id: message.author.id,
        name: message.author.username,
        level: 1,
        levelEnabled: level,
        servers: [server],
        pmNotifications: pms,
        xp: 2,
        avatar: message.author.avatarURL,
        created: Date.now(),
        banned: false,
        favorites: [],
        cookies: []
    });
    freshUser.save(function (err) {
        // console.log('Created User!');
        if (err) return cb(err);
        cb();
    });
};
var calcXpNeeded = function (User) {
    return Math.floor(User.level * 2 * 3.14 * 15);
};
var calcXpNeededNumber = function (level) {
    return Math.floor(level * 2 * 3.14 * 15);
};
var updateXp = function (bot, message, cb) {
    var serverId = message.server.id;
    // console.log('Started update XP!');
    userModel.findOne({id: message.author.id}, function (err, User) {
        if (err) return cb(err);
        if (User) {
            if (hasServer(message, User)) {
                var clientServer = loadServerFromUser(message, User);
                // console.log('User has Server');
                if (levelEnabled(message, User) && !cooldown(clientServer)) {
                    // console.log('User has Level enabled and has no Cooldown!');
                    User.updateXP(serverId, function (err) {
                        if (err) return cb(err);
                        // console.log('Updated Xp');
                        if (typeof (clientServer) !== 'undefined' && clientServer.xp >= calcXpNeeded(User)) {
                            User.updateLevel(serverId, function (err) {
                                if (err) return cb(err);
                                if (pmNotifications(message, User)) {
                                    bot.sendMessage(User.id, 'You just reached **Level ' + parseInt(clientServer.level + 1) + '** on Server: **' + message.server.name + '**');
                                }
                            });
                        }
                    });
                }
            } else {
                // console.log('added Server!');
                User.addServer(getServerObj(message, true, true), function (err) {
                    if (err) return cb(err);
                    cb();
                });
            }
        } else {
            // console.log('Create User!');
            createUser(message, true, true, function (err) {
                if (err) return cb(err);
                cb()
            });
        }
    });

};
var getLevel = function getLevel(bot, message, cb) {
    if (!message.channel.isPrivate) {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return cb(err);
            if (User) {
                if (hasServer(message, User) && levelEnabled(message, User)) {
                    var clientServer = loadServerFromUser(message, User);
                    bot.reply(message, 'You are **Level ' + clientServer.level + '** XP: ' + parseInt(clientServer.xp) + 'XP/' + parseInt(calcXpNeeded(clientServer)) + 'XP Total XP:**' + clientServer.totalXp + '**');
                } else {
                    bot.reply(message, 'You disabled Xp for yourself on this Server.');
                }
            } else {
                createUser(message, true, true, function (err) {
                    if (err) return cb(err);
                    cb()
                });
                bot.reply(message, 'You are **Level ' + 1 + '** XP: ' + parseInt(2) + 'XP/' + parseInt(calcXpNeededNumber(1)) + 'XP');
            }
        });
    }
};
var disableLevel = function disableLevel(bot, message) {
    if (!message.channel.isPrivate) {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return cb(err);
            if (User) {
                if (hasServer(message, User)) {
                    if (levelEnabled(message, User)) {
                        User.disableLevel(message.server.id,function (err) {
                            if (err) return console.log(err);
                            bot.reply(message, 'Ok, i disabled the XP System for you.');
                        });
                    } else {
                        User.enableLevel(message.server.id,function (err) {
                            if (err) return console.log(err);
                            bot.reply(message, 'Ok, i enabled the XP System for you.');
                        });
                    }
                } else {
                    User.addServer(getServerObj(message, false, false), function (err) {
                        if (err) return console.log(err);
                        bot.reply(message, 'Ok, i disabled the XP System for you.');
                    });
                }
            } else {
                createUser(message, false, false, function (err) {
                    if (err) return console.log(err);
                    bot.reply(message, 'Ok, i disabled the XP System for you.');
                });
            }
        });
    }
};
var disablePm = function disablePm(bot, message) {
    if (!message.channel.isPrivate) {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return cb(err);
            if (User) {
                if (pmNotifications(message, User)) {
                    User.disablePm(message.server.id,function (err) {
                        if (err) return console.log(err);
                        bot.reply(message, 'Ok, i disabled the Pm Notifications on this Server for you.');
                    });
                } else {
                    User.enablePm(message.server.id,function (err) {
                        if (err) return console.log(err);
                        bot.reply(message, 'Ok, i enabled the Pm Notifications on this Server for you.');
                    });
                }
            } else {
                createUser(message, true, false, function (err) {
                    if (err) return console.log(err);
                    bot.reply(message, 'Ok, i disabled the Pm Notifications on this Server for you.');
                });
            }
        });
    }
};
var hasWolkeBot = function (bot, message, User) {
    var role = {};
    if (typeof (User) === 'undefined') {
        for (role of message.server.rolesOfUser(message.author)) {
            if (role.name === 'WolkeBot') {
                return true;
            }
        }
    } else {
        for (role of message.server.rolesOfUser(User)) {
            if (role.name === 'WolkeBot') {
                return true;
            }
        }
    }
    return false;
};
var isOwner = function (bot, message) {
    return message.author.equals(message.server.owner);
};
var levelEnabled = function (message, User) {
    for (var i = 0; i < User.servers.length; i++) {
        if (User.servers[i].serverId === message.server.id && User.servers[i].levelEnabled === true) {
            return true;
        }
        if (User.servers[i].serverId === message.server.id && User.servers[i].levelEnabled === false) {
            return false;
        }
    }
};
var pmNotifications = function (message, User) {
    for (var i = 0; i < User.servers.length; i++) {
        if (User.servers[i].serverId === message.server.id && User.servers[i].pmNotifications === true) {
            return true;
        }
        if (User.servers[i].serverId === message.server.id && User.servers[i].pmNotifications === false) {
            return false;
        }
    }
};
var cooldown = function (User) {
    if (User.cooldown > Date.now() - 15000) {
        // console.log('cooldown.');
        return true;
    } else {
        // console.log(User.cooldown);
        // console.log(Date.now()-15000);
        // console.log('No Cooldown.');
        return false;
    }
};
var hasServer = function (message, User) {
    for (var i = 0; i < User.servers.length; i++) {
        if (User.servers[i].serverId === message.server.id) {
            return true;
        }
    }
    return false;
};
var loadServerFromUser = function (message, User) {
    for (var i = 0; i < User.servers.length; i++) {
        if (User.servers[i].serverId === message.server.id) {
            return User.servers[i];
        }
    }
    return;
};
var getServerObj = function (message, level, pms) {
    return {
        serverId: message.server.id,
        level: 1,
        xp: 2,
        totalXp: 2,
        cookies: 0,
        levelEnabled: level,
        pmNotifications: pms,
        cooldown: Date.now(),
        warned: [],
        kicked: [],
        banned: []
    };
};
module.exports = {
    cleanMessage: cleanMessage,
    createUser: createUser,
    updateXP: updateXp,
    getLevel: getLevel,
    disableLevel: disableLevel,
    disablePm: disablePm,
    hasWolkeBot: hasWolkeBot,
    isOwner: isOwner,
    loadServerFromUser:loadServerFromUser,
    hasServer:hasServer,
    getServerObj:getServerObj
};