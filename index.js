/**
 * Created by julian on 15.05.2016.
 */
var Discord = require("discord.js");
var bot = new Discord.Client();
var CMD = require('./helper/commands/cmdman');
var config = require('./config/main.json');
bot.loginWithToken(config.token, function (err) {
    if (err) return console.log('Error Logging in!');
});
console.log('bot started!');
bot.on('ready', function () {
    bot.setStatus('online','!w.help for Commands!', function (err) {
        if (err) return console.log(err);
    });
    bot.on('serverCreated', function (server) {
        console.log('Servers changed!');
    });
});
bot.on("message", function(message) {
    if(message.content.charAt(0) === "!") {
        CMD.basic(bot,message);
    }
});
bot.on("debug",console.log);
bot.on("warn",console.log);
bot.options = {autoReconnect:true};