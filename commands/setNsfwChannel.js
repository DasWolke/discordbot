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
            if (err) return winston.info(err);
            if (Server) {
                serverModel.update({id: message.guild.id}, {$addToSet: {nsfwChannels: message.channel.id}}, function (err) {
                    if (err) return winston.info(err);
                    message.reply(t('set-lewd.success', {lngs:message.lang, channel:message.channel, interpolation:{escape:false}}));
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
                message.reply(t('set-lewd.success', {lngs:message.lang, channel:message.channel, interpolation:{escape:false}}));
            }
        });
    } else {
        message.reply(t('generic.no-permission', {lngs:message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};