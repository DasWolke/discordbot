/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var userModel = require('../DB/user');
var winston = logger.getT();
var cmd = 'eatCookie';
var execute = function (message) {
    userModel.findOne({id: message.author.id, 'servers.serverId': message.guild.id}, function (err, User) {
        if (err) return console.log(err);
        if (User) {
            if (messageHelper.hasGuild(message, User)) {
                var clientServer = messageHelper.loadServerFromUser(message, User);
                if (typeof (clientServer.cookies) !== 'undefined' && clientServer.cookies > 0) {
                    userModel.update({
                        id: User.id,
                        'servers.serverId': message.guild.id
                    }, {$inc: {'servers.$.cookies': -1}}, function (err) {
                        if (err) return console.log(err);
                        message.reply(`You just ate 1 Cookie! http://i.giphy.com/L0nV2FkR5RpkY.gif`);
                    });
                } else {
                    message.channel.sendMessage('You dont have any Cookies to eat. \n http://i.giphy.com/Kf2ndcv58AepW.gif', function (err) {

                    });
                }
            } else {
                User.addServer(message.getServerObj(message, true, true), function (err) {
                    if (err) return console.log(err);
                });
                message.channel.sendMessage('You dont have any Cookies to eat. \n http://i.giphy.com/Kf2ndcv58AepW.gif');
            }
        } else {
            messageHelper.createUser(message, true, true, function (err) {
                if (err) return console.log(err);
                message.channel.sendMessage('You dont have any Cookies to eat. \n http://i.giphy.com/Kf2ndcv58AepW.gif');
            });
        }
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};