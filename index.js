/**
 * Created by julian on 15.05.2016.
 */
console.log('Starting Init!');
var Discord = require("discord.js");
var bot = new Discord.Client();
var CMD = require('./helper/cmdman');
var config = require('./config/main.json');
var mongoose = require('mongoose');
var socket = require('socket.io-client')('http://127.0.0.1:7004/bot');
var socketManager = require('./helper/socket/basic');
var messageHelper = require('./helper/utility/message');
var voice = require('./helper/utility/voice');
console.log('Connecting to DB');
mongoose.connect('mongodb://localhost/discordbot', function (err) {
    if (err) return console.log("Unable to connect to Mongo Server!");
    console.log('Connected to DB!');
});
console.log('Logging in...');
bot.loginWithToken(config.token, function (err) {
    if (err) return console.log('Error Logging in!');
    console.log('Connected to Discord!');
});
socketManager.init(socket);
bot.options = {
    autoReconnect: true, guildCreateTimeout: 5000, disableEveryone: true, userAgent: {
        url: "https://github.com/DasWolke/discordbot",
        version: config.version
    }, forceFetchUsers: true
};
console.log('Bot finished Init');
bot.on('ready', function () {
    bot.setStatus('online', '!w.help for Commands!', function (err) {
        if (err) return console.log(err);
    });
    bot.on('serverCreated', function (server) {
        console.log('Joined Server ' + server.name);
    });
    setTimeout(function () {
        console.log('start loading Voice!');
        for (var server of bot.servers) {
            voice.loadVoice(server, function (err, id) {
                if (err) console.log(err);
                if (typeof (id) !== 'undefined' && id !== '') {
                    var channel = voice.getChannelById(server, id);
                    bot.joinVoiceChannel(channel, function (err, connection) {
                        if (err) return console.log(err);
                        if (channel.members.length > 1) {

                        }
                    });
                }
            });
        }
    }, 5000)
});
bot.on('disconnected', function () {

});
bot.on("message", function (message) {
    if (message.content.charAt(0) === "!") {
        if (message.content.charAt(1) === "w") {
            CMD.basic(bot, message);
            CMD.music(bot, message);
            CMD.osuNoMusic(bot, message);
            CMD.youtube(bot, message);
            // CMD.permission(bot,message);
            // CMD.playlist(bot,message);
        }
    } else if (!message.channel.isPrivate && !message.isMentioned(bot.user)) {
        messageHelper.updateXP(bot, message, function (err) {
            if (err) return console.log(err);
        });
    }
    if (message.isMentioned(bot.user)) {
        CMD.cleverbot.talk(bot, message);
    }
});
bot.on("debug", console.log);
bot.on("warn", console.log);