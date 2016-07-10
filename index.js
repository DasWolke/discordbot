/**
 * Created by julian on 15.05.2016.
 */
console.log('Starting Init!');
var Discord = require("discord.js");
var bot = new Discord.Client();
var CMD = require('./helper/cmdman');
var config = require('./config/main.json');
var mongoose = require('mongoose');
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
bot.options = {autoReconnect: true};
console.log('Bot finished Init');
bot.on('ready', function () {
    bot.setStatus('online', '!w.help for Commands!', function (err) {
        if (err) return console.log(err);
    });
    bot.on('serverCreated', function (server) {
        console.log('Servers changed!');
    });
});
bot.on("message", function (message) {
    if (message.content.charAt(0) === "!") {
        if (message.content.charAt(1) === "w") {
            CMD.basic(bot, message);
            CMD.music(bot, message);
            CMD.playlist(bot, message);
        }
    }
});
bot.on("debug", console.log);
bot.on("warn", console.log);