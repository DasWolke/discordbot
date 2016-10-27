var cmd = 'reset';
var logger = require('../../../utility/logger');
var serverModel = require('../../../DB/server');
var messageHelper = require('../../../utility/message');
var winston = logger.getT();
var i18nBean = require('../../../utility/i18nManager');
var t = i18nBean.getT();
var execute = function (message) {
    if (message.guild && messageHelper.hasWolkeBot(message)) {
        serverModel.findOne({id: message.guild.id}, (err, Server) => {
            if (err) return winston.error(err);
            if (Server) {
                Server.setLeave('', '', (err) => {
                    if (err) return winston.error(err);
                    message.channel.sendMessage(':ok_hand: ');
                });
            }
        })
    } else {
        message.reply(t('generic.no-permission', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};