var cmd = 'set';
var logger = require('../../../utility/logger');
var messageHelper = require('../../../utility/message');
var serverModel = require('../../../DB/server');
var winston = logger.getT();
var i18nBean = require('../../../utility/i18nManager');
var t = i18nBean.getT();
var execute = function (message) {
    let messageSplit = message.content.split(' ').slice(3);
    // winston.info(messageSplit);
    if (messageSplit.length > 0) {
        if (message.guild && messageHelper.hasWolkeBot(message)) {
            serverModel.findOne({id: message.guild.id}, (err, Server) => {
                if (err) return winston.error(err);
                if (Server) {
                    var messageSearch = "";
                    for (var a = 0; a < messageSplit.length; a++) {
                        messageSearch = messageSearch + " " + messageSplit[a]
                    }
                    messageSearch.trim();
                    Server.setJoin(messageSearch, message.channel.id, (err) => {
                        if (err) return winston.error(err);
                        message.channel.sendMessage(':ok_hand: ');
                    })
                }
            })
        } else {
            message.reply(t('generic.no-permission', {lngs: message.lang}));
        }
    } else {
        message.reply(t('greeting.no-greeting', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};