/**
 * Created by julia on 04.09.2016.
 */
//bot.sendFile(message.channel,'http://i.giphy.com/L0nV2FkR5RpkY.gif');
var userModel = require('../../../DB/user');
var messageHelper = require('../../utility/message');
var eatCookie = function (bot,message) {
    userModel.findOne({id: message.author.id, 'servers.serverId': message.server.id}, function (err, User) {
        if (err) return console.log(err);
        if (User) {
            if (messageHelper.hasServer(message, User)) {
                var clientServer = messageHelper.loadServerFromUser(message, User);
                if (typeof (clientServer.cookies) !== 'undefined' && clientServer.cookies > 0) {
                    userModel.update({
                        id: User.id,
                        'servers.serverId': message.server.id
                    }, {$inc: {'servers.$.cookies': -1}}, function (err) {
                        if (err) return console.log(err);
                        bot.reply(message, `You just ate 1 Cookie! http://i.giphy.com/L0nV2FkR5RpkY.gif`);
                    });
                } else {
                    bot.sendMessage(message.channel, 'You dont have any Cookies to eat. \n http://i.giphy.com/Kf2ndcv58AepW.gif', function (err) {

                    });
                }
            } else {
                User.addServer(message.getServerObj(message, true, true), function (err) {
                    if (err) return console.log(err);
                });
                bot.sendMessage(message.channel, 'You dont have any Cookies to eat. \n http://i.giphy.com/Kf2ndcv58AepW.gif');
            }
        } else {
            messageHelper.createUser({author: user, server: message.server}, true, true, function (err) {
                if (err) return console.log(err);
                bot.sendMessage(message.channel, 'You dont have any Cookies to eat. \n http://i.giphy.com/Kf2ndcv58AepW.gif');
            });
        }
    });
};
module.exports = eatCookie;