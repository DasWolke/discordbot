/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'setPrefix';
var messageHelper = require('../utility/message');
var serverModel = require('../DB/server');
var msgReg = /<@[0-9]+>/;
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message)) {
            if (typeof (messageSplit[1]) !== 'undefined' && !msgReg.test(messageSplit[1])) {
                serverModel.findOne({id: message.guild.id}, function (err, Server) {
                    if (err) return cb(err);
                    if (Server) {
                        Server.updatePrefix(messageSplit[1], err => {
                            if (err) return console.log(err);
                            message.reply(`Ok i just set the prefix to ${messageSplit[1]}`);
                        });
                    } else {
                        let server = new serverModel({
                            id: message.guild.id,
                            nsfwChannels: [],
                            lastVoiceChannel: "",
                            levelEnabled: true,
                            pmNotifications: true,
                            prefix: messageSplit[1]
                        });
                        server.save(err => {
                            if (err) return console.log(err);
                            message.reply(`Ok i just set the prefix to ${messageSplit[1]}`);
                        });
                    }
                });
            } else {
                message.reply('Please add a prefix!');
            }
        } else {
            message.reply('No Permission, you need a Discord Role called WolkeBot for this Command!');
        }
    } else {
        message.reply(`This Command does not work in PM'S`);
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};