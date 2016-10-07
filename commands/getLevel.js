/**
 * Created by julia on 03.10.2016.
 */
var cmd = 'level';
var serverModel = require('../DB/server');
var messageHelper = require('../utility/message');
var execute = function (message) {
    if (message.guild) {
        serverModel.findOne({id: message.guild.id}, function (err, Server) {
            if (err) return cb(err);
            if (Server && typeof (Server.levelEnabled) === 'undefined' || Server && Server.levelEnabled || !Server) {
                messageHelper.getLevel(message, err => {
                    if (err) return cb(err);
                });
            } else {
                message.reply(`The XP system is disabled on this server!`);
            }
        });
    } else {
        message.reply('This command does not work in a private message!');
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};