/**
 * Created by julia on 23.08.2016.
 */
var messageHelper = require('../utility/message');
var serverModel = require('../../DB/server');
var r34 = require('./lewd/rule34');
var konachan = require('./lewd/konachan');
var e621 = require('./lewd/e621');
var yandere = require('./lewd/yandere');
var lewdCmds = function (bot,message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.r34":
            messageHelper.checkNsfw(bot,message, function (err) {
                if (err) return bot.reply(err);
                r34(bot,message,messageSplit)
            });
            return;
        case "!w.kona":
            messageHelper.checkNsfw(bot,message, function (err) {
                if (err) return bot.reply(err);
                konachan(bot,message,messageSplit)
            });
            return;
        case "!w.e621":
            messageHelper.checkNsfw(bot,message, function (err) {
                if (err) return bot.reply(err);
                e621(bot,message,messageSplit)
            });
            return;
        case "!w.yandere":
            messageHelper.checkNsfw(bot,message, function (err) {
                if (err) return bot.reply(err);
                yandere(bot,message,messageSplit)
            });
            return;
        case "!w.setLewd":
            if (message.guild && messageHelper.hasWolkeBot(bot, message)) {
                serverModel.findOne({id: message.guild.id}, function (err, Server) {
                    if (err) return console.log(err);
                    if (Server) {
                        serverModel.update({id: message.guild.id}, {$addToSet: {nsfwChannels: message.channel.id}}, function (err) {
                            if (err) return console.log(err);
                            message.reply(`Successfully added ${message.channel.name} to the NSFW Channels!`);
                        });
                    } else {
                        var server = new serverModel({
                            id: message.guild.id,
                            lastVoiceChannel: "",
                            nsfwChannels: [message.channel.id],
                            cmdChannel: "",
                            permissions: [],
                            prefix: "!w",
                            disabledCmds: [],
                            Groups: [],
                            Blacklist: []
                        });
                        server.save();
                        message.reply(`Successfully added ${message.channel.name} to the NSFW Channels!`);
                    }
                });
            } else {
                message.reply("You need the WolkeBot Discord Role for this Command!");
            }
            return;
        case "!w.remLewd":
            if (message.guild && messageHelper.hasWolkeBot(bot, message)) {
                serverModel.findOne({id: message.guild.id}, function (err, Server) {
                    if (err) return console.log(err);
                    if (Server) {
                        serverModel.update({id: message.guild.id}, {$pull: {nsfwChannels: message.channel.id}}, function (err) {
                            if (err) return console.log(err);
                            message.reply(`Successfully removed ${message.channel.name} from the NSFW Channels!`)
                        });
                    } else {
                        var server = new serverModel({
                            id: message.guild.id,
                            lastVoiceChannel: "",
                            nsfwChannels: [],
                            cmdChannels: [],
                            permissions: [],
                            prefix: "!w",
                            disabledCmds: [],
                            Groups: [],
                            Blacklist: []
                        });
                        server.save();
                        message.reply(`There are no NSFW Channels yet.`);
                    }
                });
            } else {
                message.reply("You need the WolkeBot Discord Role for this Command!");
            }
            return;
        case "!w.lewd":
            bot.sendFile(message.channel, 'https://cdn.discordapp.com/attachments/191455136013352960/209718642722603008/412.png');
            return;
        default:
            return;
    }
};
module.exports = lewdCmds;
