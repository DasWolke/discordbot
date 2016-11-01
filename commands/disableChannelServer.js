/**
 * Created by julia on 03.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'noChServer';
var serverModel = require('../DB/server');
var messageHelper = require('../utility/message');
var logger = require('../utility/logger');
var winston = logger.getT();
var execute = function (message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message)) {
            serverModel.findOne({id: message.guild.id}, function (err, Server) {
                if (err) return winston.info(err);
                if (Server) {
                    if (typeof (Server.pmNotifications) === 'undefined' || Server.pmNotifications) {
                        Server.updatePms(false, err => {
                            if (err) return winston.info(err);
                            Server.updateChannel(true, err=> {
                                if (err) return winston.info(err);
                                message.reply(t('no-channel-server.success-disable', {lngs: message.lang}));
                            });
                        });
                    } else {
                        Server.updatePms(true, err => {
                            if (err) return winston.info(err);
                            Server.updateChannel(false, err=> {
                                if (err) return winston.info(err);
                                message.reply(t('no-channel-server.success-enable', {lngs: message.lang}));
                            });
                        });
                    }
                } else {
                    let server = new serverModel({
                        id: message.guild.id,
                        nsfwChannels: [],
                        lastVoiceChannel: "",
                        levelEnabled: true,
                        pmNotifications: false,
                        chNotifications: true,
                        prefix: "!w."
                    });
                    server.save(err => {
                        if (err) return winston.info(err);
                        message.reply(t('no-pm-server.success-disable', {lngs: message.lang}));
                    });
                }
            });
        } else {
            message.reply(t('generic.no-permission', {lngs: message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'moderation'};