/**
 * Created by julia on 03.10.2016.
 */
var cmd = 'noPmServer';
var serverModel = require('../DB/server');
var messageHelper = require('../utility/message');
var execute = function (message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message)) {
            serverModel.findOne({id: message.guild.id}, function (err, Server) {
                if (err) return console.log(err);
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
                        pmNotifications: false,
                        prefix:"!w."
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
module.exports = {cmd:cmd, accessLevel:0, exec:execute};