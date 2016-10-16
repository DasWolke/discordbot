/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var serverModel = require('../DB/server');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'setLewd';
var execute = function (message) {
    if (message.guild && messageHelper.hasWolkeBot(message)) {
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
                    prefix: "!w.",
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
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};