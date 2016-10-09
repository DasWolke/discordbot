/**
 * Created by julia on 03.10.2016.
 */
var cmd = 'noLevelServer';
var serverModel = require('../DB/server');
var messageHelper = require('../utility/message');
var execute = function (message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message)) {
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
                        pmNotifications: true,
                        prefix:"!w."
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
module.exports = {cmd:cmd, accessLevel:0, exec:execute};