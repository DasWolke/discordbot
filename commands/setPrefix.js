/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
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
                            message.reply(t('prefix.success', {lngs:message.lang, prefix:messageSplit[1]}));
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
                            message.reply(t('prefix.success', {lngs:message.lang, prefix:messageSplit[1]}));
                        });
                    }
                });
            } else {
                message.reply(t('prefix.no-prefix', {lngs:message.lang}));
            }
        } else {
            message.reply(t('generic.no-permission', {lngs:message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};