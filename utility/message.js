/**
 * Created by julia on 18.07.2016.
 */
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
                pmNotifications: true
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
var updateUserLevel = function (message,Server, cb) {
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
                                    message.author.sendMessage('You just reached **Level ' + parseInt(clientServer.level + 1) + '** on Server: **' + message.guild.name + '**');
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
                    message.reply('You are **Level ' + clientServer.level + '** XP: ' + parseInt(clientServer.xp) + 'XP/' + parseInt(calcXpNeeded(clientServer)) + 'XP Total XP:**' + clientServer.totalXp + '**');
                } else {
                    message.reply('You disabled Xp for yourself on this Server.');
                }
            } else {
                createUser(message, true, true, function (err) {
                    if (err) return cb(err);
                    cb()
                });
                message.reply('You are **Level ' + 1 + '** XP: ' + parseInt(2) + 'XP/' + parseInt(calcXpNeededNumber(1)) + 'XP');
            }
        });
    }
};
var disableLevel = function disableLevel(message) {
    if (message.guild) {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return cb(err);
            if (User) {
                if (hasGuild(message, User)) {
                    if (levelEnabled(message, User)) {
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
                    User.addServer(getServerObj(message, false, false), function (err) {
                        if (err) return console.log(err);
                        message.reply('Ok, i disabled the XP System for you.');
                    });
                }
            } else {
                createUser(message, false, false, function (err) {
                    if (err) return console.log(err);
                    message.reply('Ok, i disabled the XP System for you.');
                });
            }
        });
    }
};
var disableLevelServer = function disableLevel(message) {
    if (message.guild) {
        if (hasWolkeBot(message)) {
            serverModel.findOne({id: message.guild.id}, function (err, Server) {
                if (err) return cb(err);
                if (Server) {
                    if (typeof (Server.levelEnabled) === 'undefined' || Server.levelEnabled) {
                        Server.updateLevels(false, err => {
                            if (err) return console.log(err);
                            message.reply(`Ok i just disabled the level system for this server, type this command to enable it again.`);
                        });
                    } else {
                        Server.updateLevels(true, err => {
                            if (err) return console.log(err);
                            message.reply(`Ok i just enabled the level system for this server, type this command to disable it again.`);
                        });
                    }
                } else {
                    let server = new serverModel({
                        id: message.guild.id,
                        nsfwChannels: [],
                        lastVoiceChannel: "",
                        levelEnabled: false,
                        pmNotifications: true
                    });
                    server.save(err => {
                        if (err) return console.log(err);
                        message.reply(`Ok i just disabled the level system for this server, type this command to enable it again.`);
                    });
                }
            });
        } else {
            message.reply('No Permission, you need a Discord Role called WolkeBot for this Command!');
        }
    } else {
        message.reply(`This Command does not work in PM'S`);
    }
};
var disablePmServer = function disablePmServer(message) {
    if (message.guild) {
        if (hasWolkeBot(message)) {
            serverModel.findOne({id: message.guild.id}, function (err, Server) {
                if (err) return cb(err);
                if (Server) {
                    if (typeof (Server.pmNotifications) === 'undefined' || Server.pmNotifications) {
                        Server.updatePms(false, err => {
                            if (err) return console.log(err);
                            message.reply(`Ok i just disabled pm notifications for this server, type this command to enable it again.`);
                        });
                    } else {
                        Server.updatePms(true, err => {
                            if (err) return console.log(err);
                            message.reply(`Ok i just enabled pm notifications for this server, type this command to disable it again.`);
                        });
                    }
                } else {
                    let server = new serverModel({
                        id: message.guild.id,
                        nsfwChannels: [],
                        lastVoiceChannel: "",
                        levelEnabled: true,
                        pmNotifications: false
                    });
                    server.save(err => {
                        if (err) return console.log(err);
                        message.reply(`Ok i just disabled pm notifications for this server, type this command to enable it again.`);
                    });
                }
            });
        } else {
            message.reply('No Permission, you need a Discord Role called WolkeBot for this Command!');
        }
    } else {
        message.reply(`This Command does not work in PM'S`);
    }
};
var disablePm = function disablePm(message) {
    if (message.guild) {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return cb(err);
            if (User) {
                if (pmNotifications(message, User)) {
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
                createUser(message, true, false, function (err) {
                    if (err) return console.log(err);
                    message.reply('Ok, i disabled the Pm Notifications on this Server for you.');
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
    return message.author.equals(message.guild.owner);
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
        // console.log('cooldown.');
        return true;
    } else {
        // console.log(User.cooldown);
        // console.log(Date.now()-15000);
        // console.log('No Cooldown.');
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
                return cb('This Channel is not a NSFW Channel.');
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
                    return cb('Please set/add a NSFW Channel with !w.setLewd (in one of the NSFW Channels) so that normal Users can use this Command too or get the WolkeBot Role.');
                }
            }
        } else {
            if (hasWolkeBot(message)) {
                return cb();
            } else {
                return cb('Please set/add a NSFW Channel with !w.setLewd (in one of the NSFW Channels) so that normal Users can use this Command too or get the WolkeBot Role.');
            }
        }
    });
};
module.exports = {
    cleanMessage: cleanMessage,
    createUser: createUser,
    updateXP: updateXp,
    getLevel: getUserLevel,
    disableLevel: disableLevel,
    disablePm: disablePm,
    disableLevelServer: disableLevelServer,
    disablePmServer:disablePmServer,
    levelEnabled:levelEnabled,
    hasWolkeBot: hasWolkeBot,
    isOwner: isOwner,
    loadServerFromUser: loadServerFromUser,
    hasGuild: hasGuild,
    getServerObj: getServerObj,
    noSpam: noSpam,
    checkNsfw: checkNsfwChannel,
    pmNotifications:pmNotifications
};