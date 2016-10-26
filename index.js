/**
 * Created by julian on 15.05.2016.
 */
var config = require('./config/main.json');
var winston = require('winston');
var prefix = "!w.";
var shard_id = process.env.SHARD_ID;
var shard_count = process.env.SHARD_COUNT;
winston.info(`Starting Init of Bot!`);
winston.add(winston.transports.File, {filename: `logs/rem-main.log`});
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
    client.patchGlobal(() => {
        winston.error('Oh no I died!');
        process.exit(1);
    });
}
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
            protocol_version: 6,
            max_message_cache: 2500,
            disable_everyone: true
        };
        winston.info(options);
        var bot = new Discord.Client(options);
        var CMD = require('./utility/cmdManager');
        var request = require('request');
        var mongoose = require('mongoose');
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
            bot.user.setStatus('online', `!w.help | shard ${parseInt(shard_id) + 1}/${shard_count}`).then().catch(winston.info);
            CMD.init();
            // setTimeout(() => {
            //     winston.info('start loading Voice!');
            //     async.eachLimit(bot.guilds.array(), 8, (guild, cb) => {
            //         voice.loadVoice(guild).then(id => {
            //             if (err) return cb(err);
            //             if (typeof (id) !== 'undefined' && id !== '') {
            //                 winston.info('started joining guild:' + guild.name);
            //                 var channel = voice.getChannelById(guild, id);
            //                 if (typeof (channel) !== 'undefined' && channel) {
            //                     channel.join().then(connection => {
            //                         var message = {guild: guild};
            //                         voice.autoStartQueue(message);
            //                         return cb();
            //                     }).catch((err) => {
            //                         winston.error(err);
            //                         return cb();
            //                     });
            //                 }
            //             } else {
            //                 setTimeout(() => {
            //                     return cb();
            //                 }, 1000)
            //             }
            //         }).catch(winston.error);
            //     }, (err) => {
            //         if (err) {
            //             return winston.error(err);
            //         }
            //         winston.info('Finished Loading Voice!');
            //     });
            // }, 10000);
            // if (!config.beta) {
            //     updateStats();
            //     dogstatsd.gauge('musicbot.guilds', bot.guilds.size);
            //     dogstatsd.gauge('musicbot.users', users());
            // }
            // if (!config.beta) {
            //     setInterval(() => {
            //         dogstatsd.gauge('musicbot.guilds', bot.guilds.size);
            //         dogstatsd.gauge('musicbot.users', users());
            //     }, 1000 * 30);
            // }
            // if (!config.beta) {
            //     setInterval(() => {
            //         updateStats();
            //     }, 1000 * 60 * 30);
            // }
        });
        bot.on('reconnecting', () => {
            // winston.info('Reconnecting to Discord!');
        });
        bot.on("message", (message) => {
            if (!message.guild || config.beta && message.guild.id !== '110373943822540800' || !config.beta) {
                message.lang = ['en', 'en'];
                message.langList = list;
                message.shard_id = shard_id;
                message.shard_count = shard_count;
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
        // bot.on('guildMemberRemove', (Guild, member) => {
        //     if (Guild.id !== '110373943822540800') {
        //         Guild.defaultChannel.sendMessage(`**${member.user.username}** just left us`);
        //     }
        // });
        bot.on("debug", winston.info);
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
function buildLang(list) {
    let i = list.length;
    let answer = "";
    while (i--) {
        answer = answer + `${list[i]}|`;
    }
    return answer;
}
// "shard_id":process.argv[2],
// "shard_count":config.shards