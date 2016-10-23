/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'setLang';
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var serverModel = require('../DB/server');
var msgReg = /<@[0-9]+>/;
var config = require('../config/main.json');
var logger = require('../utility/logger');
var winston = logger.getT();
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message) || config.beta) {
            if (typeof (messageSplit[1]) !== 'undefined' && !msgReg.test(messageSplit[1])) {
                if(messageSplit[1] === 'ru' || messageSplit[1] === 'de' || messageSplit[1] === 'en') {
                    serverModel.findOne({id: message.guild.id}, function (err, Server) {
                        if (err) return cb(err);
                        if (Server) {
                            Server.updateLanguage(messageSplit[1], err => {
                                if (err) return winston.info(err);
                                message.channel.sendMessage(t('set-lang.success', {
                                    lng: messageSplit[1],
                                    language: messageSplit[1]
                                }));
                            });
                        } else {
                            let server = new serverModel({
                                id: message.guild.id,
                                nsfwChannels: [],
                                lastVoiceChannel: "",
                                levelEnabled: true,
                                pmNotifications: true,
                                lngs: messageSplit[1],
                                prefix:"!w."
                            });
                            server.save(err => {
                                if (err) return winston.info(err);
                                message.channel.sendMessage(t('set-lang.success', {
                                    lng: messageSplit[1],
                                    language: messageSplit[1]
                                }));
                            });
                        }
                    });
                } else {
                    message.channel.sendMessage(t('set-lang.unsupported', {lngs: message.lang}));
                }
            } else {
                message.channel.sendMessage(t('set-lang.no-lang', {lngs: message.lang}));
            }
        } else {
            message.channel.sendMessage(t('generic.no-permission', {lngs: message.lang}));
        }
    } else {
        message.channel.sendMessage(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};