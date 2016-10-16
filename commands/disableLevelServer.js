/**
 * Created by julia on 03.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'noLevelServer';
var serverModel = require('../DB/server');
var messageHelper = require('../utility/message');
var execute = function (message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message)) {
            serverModel.findOne({id: message.guild.id}, function (err, Server) {
                if (err) return cb(err);
                if (Server) {
                    if (typeof (Server.levelEnabled) === 'undefined' || Server.levelEnabled) {
                        Server.updateLevels(false, err => {
                            if (err) return console.log(err);
                            message.reply(t('no-level-server.success-disable', {lngs:message.lang}));
                        });
                    } else {
                        Server.updateLevels(true, err => {
                            if (err) return console.log(err);
                            message.reply(t('no-level-server.success-enable', {lngs:message.lang}));
                        });
                    }
                } else {
                    let server = new serverModel({
                        id: message.guild.id,
                        nsfwChannels: [],
                        lastVoiceChannel: "",
                        levelEnabled: false,
                        pmNotifications: true,
                        prefix:"!w."
                    });
                    server.save(err => {
                        if (err) return console.log(err);
                        message.reply(t('no-level-server.success-disable', {lngs:message.lang}));
                    });
                }
            });
        } else {
            message.reply(t('generic.no-permission', {lngs:message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};