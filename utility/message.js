/**
 * Created by julia on 18.07.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var userModel = require('../DB/user');
var serverModel = require('../DB/server');
var config = require('../config/main.json');
var cleanMessage = function (message) {
    return message.replace("@", "");
};
var createUser = function (message, level, pms, cb) {
    var guild = getServerObj(message, level, pms);
    var freshUser = new userModel({
        id: message.author.id,
        name: message.author.username,
        servers: [guild],
        avatar: message.author.avatarURL,
        created: Date.now(),
        banned: false,
        verified: false,
        favorites: [],
        cookies: []
    });
    freshUser.save((err) => {
        // console.log('Created User!');
        if (err) return cb(err);
        cb();
    });
};
var calcXpNeeded = function (User) {
    return Math.floor(User.level * 2 * 3.14 * 15);
};
var updateXp = function (message, cb) {
    serverModel.findOne({id: message.guild.id}, function (err, Server) {
        if (err) return cb(err);
        if (Server) {
            if (typeof (Server.levelEnabled) === 'undefined' || Server.levelEnabled) {
                updateUserLevel(message, Server, err => {
                    if (err) return cb(err);
                    return cb();
                })
            } else {
                return cb();
            }
        } else {
            let server = new serverModel({
                id: message.guild.id,
                nsfwChannels: [],
                lastVoiceChannel: "",
                levelEnabled: true,
                pmNotifications: true,
                prefix: "!w."
            });
            server.save(err => {
                if (err) return cb(err);
                updateUserLevel(message, server, err => {
                    if (err) return cb(err);
                    cb();
                });
            });
        }
    });
    // console.log('Started update XP!');

};
var updateUserLevel = function (message, Server, cb) {
    let serverId = message.guild.id;
    userModel.findOne({id: message.author.id}, function (err, User) {
        if (err) return cb(err);
        if (User) {
            if (User.name !== message.author.username) {
                User.updateName(message.author.username, function (err) {
                    if (err) return console.log(err);
                });
            }
            if (hasGuild(message, User)) {
                var clientServer = loadServerFromUser(message, User);
                // console.log('User has Server');
                if (levelEnabled(message, User) && !cooldown(clientServer)) {
                    // console.log('User has Level enabled and has no Cooldown!');
                    User.updateXP(serverId, calcXpMessage(message.content), function (err) {
                        if (err) return cb(err);
                        // console.log('Updated Xp');
                        if (typeof (clientServer) !== 'undefined' && clientServer.xp + calcXpMessage(message.content) > calcXpNeeded(clientServer)) {
                            User.updateLevel(serverId, function (err) {
                                if (err) return cb(err);
                                if (pmNotifications(message, User) && typeof (Server.pmNotifications) === 'undefined' || Server.pmNotifications) {
                                    message.author.sendMessage(t('generic.level-update', {
                                        lngs: message.lang,
                                        level: clientServer.level + 1,
                                        server: message.guild.name
                                    }));
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
                cb();
            });
        }
    });
};
var calcXpMessage = function (content) {
    return 5 + calcBonus(content);
};
var calcBonus = function (content) {
    var bonus = Math.floor(content.length / 50);
    if (bonus > 10) {
        return 10;
    }
    return bonus;
};
var getUserLevel = function getUserLevel(message, cb) {
    if (message.guild) {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return cb(err);
            if (User) {
                if (hasGuild(message, User) && levelEnabled(message, User)) {
                    var clientServer = loadServerFromUser(message, User);
                    cb(null, clientServer)
                } else {
                    cb('OH Nooooo');
                }
            } else {
                let clientServer = {level: 1, xp: 5, totalXp: 5};
                createUser(message, true, true, function (err) {
                    if (err) return cb(err);
                    cb(null, clientServer);
                });
            }
        });
    }
};
var hasWolkeBot = function (message, member) {
    if (typeof (member) === 'undefined' && message.author.id === config.owner_id) {
        return true;
    }
    if (typeof (member) === 'undefined') {
        return message.member.roles.exists('name', 'WolkeBot');
    } else {
        return member.roles.exists('name', 'WolkeBot');
    }

};
var isOwner = function (message) {
    return message.author.equals(message.guild.owner.user);
};
var levelEnabled = function (message, User) {
    for (var i = 0; i < User.servers.length; i++) {
        if (User.servers[i].serverId === message.guild.id && User.servers[i].levelEnabled === true) {
            return true;
        }
        if (User.servers[i].serverId === message.guild.id && User.servers[i].levelEnabled === false) {
            return false;
        }
    }
};
var pmNotifications = function (message, User) {
    for (var i = 0; i < User.servers.length; i++) {
        if (User.servers[i].serverId === message.guild.id && User.servers[i].pmNotifications === true) {
            return true;
        }
        if (User.servers[i].serverId === message.guild.id && User.servers[i].pmNotifications === false) {
            return false;
        }
    }
};
var cooldown = function (User) {
    if (User.cooldown > Date.now() - 7500) {

        return true;
    } else {
        return false;
    }
};
var hasGuild = function (message, User) {
    for (var i = 0; i < User.servers.length; i++) {
        if (User.servers[i].serverId === message.guild.id) {
            return true;
        }
    }
    return false;
};
var loadServerFromUser = function (message, User) {
    for (var i = 0; i < User.servers.length; i++) {
        if (User.servers[i].serverId === message.guild.id) {
            return User.servers[i];
        }
    }
    return null;
};
var getServerObj = function (message, level, pms) {
    return {
        serverId: message.guild.id,
        level: 1,
        xp: 5,
        totalXp: 5,
        cookies: 0,
        levelEnabled: level,
        pmNotifications: pms,
        cooldown: Date.now(),
        warned: [],
        kicked: [],
        banned: []
    };
};
var noSpam = function (message) {
    // if(message.mentions.users.length > 25) {
    //     console.log('good.');
    // }
    console.log(message.mentions.length);
};
var checkNsfwChannel = function (message, cb) {
    serverModel.findOne({id: message.guild.id}, function (err, Server) {
        if (err) return console.log(err);
        if (Server) {
            if (typeof (Server.nsfwChannels) !== 'undefined' && Server.nsfwChannels.length > 0) {
                for (var i = 0; i < Server.nsfwChannels.length; i++) {
                    if (Server.nsfwChannels[i] === message.channel.id) {
                        return cb();
                    }
                }
                return cb(false);
            } else {
                if (typeof (Server.nsfwChannel) !== 'undefined' && Server.nsfwChannel === message.channel.id) {
                    serverModel.update({id: message.guild.id}, {
                        $addToSet: {nsfwChannels: Server.nsfwChannel},
                        $set: {nsfwChannel: ""}
                    }, function (err) {
                        if (err) return console.log(err);
                    });
                    return cb();
                } else {
                    return cb(false);
                }
            }
        } else {
            return cb(false);
        }
    });
};
var checkCmdChannel = function (message, cb) {
    serverModel.findOne({id: message.guild.id}, function (err, Server) {
        if (err) return console.log(err);
        if (Server) {
            if (typeof (Server.cmdChannels) !== 'undefined' && Server.cmdChannels.length > 0) {
                for (var i = 0; i < Server.cmdChannels.length; i++) {
                    if (Server.cmdChannels[i] === message.channel.id) {
                        return cb();
                    }
                }
                return cb({ignore: true});
            } else {
                return cb();
            }

        } else {
            return cb();
        }
    });
};
var filterSelection = (message, collector) => {
    switch (message.content) {
        case "1":
            return true;
        case "2":
            return true;
        case "3":
            return true;
        case "4":
            return true;
        case "5":
            return true;
        case "c":
            return true;
        default:
            return false;
    }
};
var buildPrologMessage = (content) => {
    let msg = "\`\`\`css\n";
    for (var i = 0; i < content.length; i++) {
        msg = msg + content[i];
    }
    msg = msg + "\`\`\`";
    return msg;
};
module.exports = {
    cleanMessage: cleanMessage,
    createUser: createUser,
    updateXP: updateXp,
    getLevel: getUserLevel,
    levelEnabled: levelEnabled,
    hasWolkeBot: hasWolkeBot,
    isOwner: isOwner,
    loadServerFromUser: loadServerFromUser,
    hasGuild: hasGuild,
    getServerObj: getServerObj,
    noSpam: noSpam,
    checkNsfw: checkNsfwChannel,
    pmNotifications: pmNotifications,
    calcXpNeeded: calcXpNeeded,
    filterSelection: filterSelection,
    buildPrologMessage: buildPrologMessage
};