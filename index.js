/**
 * Created by julian on 15.05.2016.
 */
var config = require('./config/main.json');
var winston = require('winston');
var prefix = "!w.";
winston.info(`Starting Init of Bot!`);
winston.add(winston.transports.File, {filename: `logs/rem-main.log`});
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp':true});
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
var backendOptions = {
    loadPath: 'locales/{{lng}}/{{ns}}.json',
    addPath: 'locales/{{lng}}/{{ns}}.missing.json',
    jsonIndent: 2
};
i18next.use(Backend).init({
    whitelist: ['en', 'de', 'ru'],
    backend: backendOptions,
    lng: 'en',
    fallbacklngs: false,
    preload: ['de', 'en', 'ru']
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
        bot.user.setStatus('online', `!w.help | bot.ram.moe`).then().catch(winston.info);
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
        if (!config.beta) {
            updateStats();
            dogstatsd.gauge('musicbot.guilds', bot.guilds.size);
            dogstatsd.gauge('musicbot.users', users());
        }
        if (!config.beta) {
            setInterval(() => {
                dogstatsd.gauge('musicbot.guilds', bot.guilds.size);
                dogstatsd.gauge('musicbot.users', users());
            }, 1000 * 30);
        }
        setInterval(() => {
            updateStats();
        }, 1000 * 60 * 60);
    });
    bot.on('reconnecting', () => {
        // winston.info('Reconnecting to Discord!');
    });
    bot.on("message", (message) => {
        if (!message.guild || config.beta && message.guild.id !== '110373943822540800' || !config.beta) {
            message.lang = ['en', 'en'];
            if (!config.beta) {
                dogstatsd.increment('musicbot.messages');
            }
            if (message.guild) {
                serverModel.findOne({id: message.guild.id}, function (err, Server) {
                    if (err) return winston.error(err);
                    message.dbServer = {};
                    message.dbServer.volume = "0.10";
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
    // bot.on('guildMemberAdd', (Guild, member) => {
    //     if (Guild.id !== '110373943822540800') {
    //         Guild.defaultChannel.sendMessage(`Welcome ${member.user} on **${Guild.name}**`);
    //     }
    // });
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
    var updateStats = function () {
        let id;
        if (config.beta) {
            id = config.client_id
        } else {
            id = config.bot_id
        }
        let requestOptions = {
            headers: {
                Authorization: config.discord_bots_token
            },
            url: `https://bots.discord.pw/api/bots/${id}/stats`,
            method: 'POST',
            json: {
                "server_count": bot.guilds.size
            }
        };
        request(requestOptions, function (err, response, body) {
            if (err) {
                client.captureMessage(err);
                return winston.error(err);
            }
            winston.info('Stats Updated!');
            winston.info(body);
        });
    };
    var users = function () {
        let users = 0;
        bot.guilds.map((guild => {
            if (guild.id !== '110373943822540800') {
                users = users + guild.members.size;
            }
        }));
        return users;
    };
});

// "shard_id":process.argv[2],
// "shard_count":config.shards