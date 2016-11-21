/**
 * Created by julian on 15.05.2016.
 */
var config = require('./config/main.json');
var winston = require('winston');
var prefix = "!w.";
var shard_id = process.env.SHARD_ID;
var shard_count = process.env.SHARD_COUNT;
var blocked = require('blocked');
winston.info(`Starting Init of Bot!`);
winston.add(winston.transports.File, {filename: `logs/rem-${shard_id}.log`});
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp': true});
var logger = require('./utility/logger');
logger.setT(winston);
var raven = require('raven');
var errorReporter = require('./utility/errorReporter');
var client = new raven.Client(config.sentry_token);
var serverModel = require('./DB/server');
errorReporter.setT(client);
winston.info('Starting Errorhandling!');
if (!config.beta) {
    var StatsD = require('node-dogstatsd').StatsD;
    var dogstatsd = new StatsD();
}
var i18next = require('i18next');
var i18nBean = require('./utility/i18nManager');
var Backend = require('i18next-node-fs-backend');
var fs = require("fs");
var backendOptions = {
    loadPath: 'locales/{{lng}}/{{ns}}.json',
    addPath: 'locales/{{lng}}/{{ns}}.missing.json',
    jsonIndent: 2
};
getDirs('locales/', (list) => {
    i18next.use(Backend).init({
        backend: backendOptions,
        lng: 'en',
        fallbacklngs: false,
        preload: list,
        load: 'all'
    }, (err, t) => {
        if (err) {
            client.captureMessage(err);
            return winston.error('Error at i18n' + err);
        }
        i18nBean.setT(t);
        var Discord = require("discord.js");
        var options = {
            messageCacheMaxSize: 2500,
            disableEveryone: true,
            fetchAllMembers: true,
            disabledEvents: ['typingStart', 'typingStop']
        };
        winston.info(options);
        blocked(function (ms) {
            console.log('BLOCKED FOR %sms', ms | 0);
        });
        var bot = new Discord.Client(options);
        var CMD = require('./utility/cmdManager');
        var request = require('request');
        var mongoose = require('mongoose');
        mongoose.Promise = require('bluebird');
        var socket = require('socket.io-client')('http://127.0.0.1:7004/bot');
        var socketManager = require('./utility/socket/basic');
        var messageHelper = require('./utility/message');
        var voice = require('./utility/voice');
        var async = require('async');
        var cleverbot = require('./utility/cleverbot');
        winston.info('Connecting to DB');
        let url;
        if (config.beta) {
            url = 'mongodb://localhost/discordbot-beta';
        } else {
            url = 'mongodb://localhost/discordbot';
        }
        mongoose.connect(url, (err) => {
            if (err) {
                client.captureMessage(err);
                return winston.error("Unable to connect to Mongo Server!");
            }
        });
        winston.info('Logging in...');
        bot.login(config.token).then(winston.info('Logged in successfully'));
        socketManager.init(socket);
        winston.info('Bot finished Init');

        bot.on('ready', () => {
            bot.user.setStatus('online').then().catch(winston.info);
            bot.user.setGame(`!w.help | shard ${parseInt(shard_id) + 1}/${shard_count}`, 'https://www.twitch.tv/daswolke_').then().catch(winston.info);
            CMD.init();
        });
        bot.on('debug', info => winston.info('Debug:' + info));
        bot.on('reconnecting', () => {
            // winston.info('Reconnecting to Discord!');
        });
        bot.on("message", (message) => {
            if (!message.guild && !message.author.bot || config.beta && message.guild && message.guild.id !== '110373943822540800' && !message.author.bot || !config.beta && !message.author.bot) {
                message.lang = ['en', 'en'];
                message.langList = list;
                message.shard_id = shard_id;
                message.shard_count = shard_count;
                // messageHelper.filterEmojis(message);
                if (!config.beta) {
                    dogstatsd.increment('musicbot.messages');
                }
                if (message.guild) {
                    serverModel.findOne({id: message.guild.id}, function (err, Server) {
                        if (err) return winston.error(err);
                        message.dbServer = {};
                        message.dbServer.volume = 0.25;
                        if (Server) {
                            message.dbServer = Server;
                        }
                        if (Server && typeof (Server.lng) !== 'undefined' && Server.lng && Server.lng !== '') {
                            message.lang = [Server.lng, 'en'];
                        }
                        if (Server && typeof (Server.prefix) !== 'undefined' && Server.prefix && Server.prefix !== '') {
                            if (message.content.startsWith(Server.prefix)) {
                                message.botUser = bot;
                                message.prefix = Server.prefix;
                                if (!config.beta) {
                                    dogstatsd.increment('musicbot.commands');
                                    if (message.content === Server.prefix + 'help') {
                                        dogstatsd.increment('musicbot.help');
                                    }
                                }
                                return CMD.checkCommand(message);
                            } else {
                                if (message.guild && !message.mentions.users.exists('id', bot.user.id) && !message.author.equals(bot.user) && message.guild.id !== '110373943822540800' && !message.author.bot) {
                                    messageHelper.updateXP(message, (err) => {
                                        if (err) return winston.error(err);
                                    });
                                }
                                if (message.guild && !!message.mentions.users.get(bot.user.id) && message.guild.id !== '110373943822540800' && !message.content.startsWith(prefix) && !message.author.bot) {
                                    if (!config.beta) {
                                        dogstatsd.increment('musicbot.cleverbot');
                                    }
                                    cleverbot.talk(message);
                                }
                            }
                        } else {
                            if (message.content.startsWith(prefix)) {
                                message.botUser = bot;
                                message.prefix = prefix;
                                if (!config.beta) {
                                    dogstatsd.increment('musicbot.commands');
                                    if (message.content === prefix + 'help') {
                                        dogstatsd.increment('musicbot.help');
                                    }
                                }
                                CMD.checkCommand(message);
                            } else {
                                if (message.guild && !message.mentions.users.exists('id', bot.user.id) && !message.author.equals(bot.user) && !message.author.bot) {
                                    messageHelper.updateXP(message, (err) => {
                                        if (err) return winston.error(err);
                                    });
                                }
                                if (message.guild && !!message.mentions.users.get(bot.user.id) && message.guild.id !== '110373943822540800' && !message.content.startsWith(prefix) && !message.author.bot) {
                                    if (!config.beta) {
                                        dogstatsd.increment('musicbot.cleverbot');
                                    }
                                    cleverbot.talk(message);
                                }
                            }
                        }
                    });
                } else {
                    if (message.content.startsWith(prefix)) {
                        message.botUser = bot;
                        message.prefix = prefix;
                        if (!config.beta) {
                            dogstatsd.increment('musicbot.commands');
                            if (message.content === prefix + 'help') {
                                dogstatsd.increment('musicbot.help');
                            }
                        }
                        CMD.checkCommand(message);
                    }
                }
            }
        });
        bot.on('guildCreate', (Guild, member) => {
            serverModel.findOne({id: Guild.id}, (err, server) => {
                if (err) return winston.error(err);
                if (server) {

                } else {
                    let server = new serverModel({
                        id: Guild.id,
                        nsfwChannels: [],
                        cmdChannels: [],
                        lastVoiceChannel: "",
                        levelEnabled: true,
                        pmNotifications: true,
                        chNotifications: false,
                        prefix: "!w."
                    });
                    server.save((err) => {
                        if (err) return winston.info(err);
                    });
                }
            });
        });
        bot.on('guildMemberAdd', (member) => {
            serverModel.findOne({id: member.guild.id}, (err, Server) => {
                if (err) return winston.error(err);
                if (Server) {
                    if (typeof (Server.joinText) !== 'undefined' && Server.joinText !== '' && Server.joinText) {
                        let channels = member.guild.channels.filter(c => {
                            return (c.id === Server.joinChannel)
                        });
                        let channel = channels.first();
                        let content = Server.joinText.replace('{{user}}', member.user);
                        content = content.replace('{{guild}}', member.guild.name);
                        try {
                            channel.sendMessage(content);
                        } catch (e) {

                        }
                    }
                    if (typeof (Server.roles) !== 'undefined' && Server.roles.length > 0) {
                        async.each(Server.roles, (role, cb) => {
                            if (role.default) {
                                member.addRole(role.id).then(memberNew => {
                                    return cb();
                                }).catch(err => cb(err));
                            } else {
                                async.setImmediate(() => {
                                    return cb();
                                });
                            }
                        }, (err) => {
                            if (err) return winston.error(err);
                        });
                    }
                }
            })
        });
        bot.on('guildMemberRemove', (member) => {
            serverModel.findOne({id: member.guild.id}, (err, Server) => {
                if (err) return winston.error(err);
                if (Server) {
                    if (typeof (Server.leaveText) !== 'undefined' && Server.leaveText !== '' && Server.leaveText) {
                        try {
                            let channels = member.guild.channels.filter(c => {
                                return (c.id === Server.leaveChannel)
                            });
                            let channel = channels.first();
                            let content = Server.leaveText.replace('{{user}}', member.user.username);
                            content = content.replace('{{guild}}', member.guild.name);
                            try {
                                channel.sendMessage(content);
                            } catch (e) {

                            }
                        } catch (e) {
                            winston.error(e);
                        }
                    }
                }
            })
        });
        bot.on("warn", winston.info);
        bot.on('error', (error) => {
            client.captureMessage(error);
            winston.error(error);
        });
    });
});
function getDirs(rootDir, cb) {
    fs.readdir(rootDir, function (err, files) {
        var dirs = [];
        for (var index = 0; index < files.length; ++index) {
            var file = files[index];
            if (file[0] !== '.') {
                var filePath = rootDir + '/' + file;
                fs.stat(filePath, function (err, stat) {
                    if (stat.isDirectory()) {
                        dirs.push(this.file);
                    }
                    if (files.length === (this.index + 1)) {
                        return cb(dirs);
                    }
                }.bind({index: index, file: file}));
            }
        }
    });
}
// "shard_id":process.argv[2],
// "shard_count":config.shards