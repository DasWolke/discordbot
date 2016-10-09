/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var serverModel = require('../DB/server');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'remLewd';
var execute = function (message) {
    if (message.guild && messageHelper.hasWolkeBot(message)) {
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
                    prefix: "!w.",
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
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};