/**
 * Created by julia on 03.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'noPmServer';
var serverModel = require('../DB/server');
var messageHelper = require('../utility/message');
var execute = function (message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message)) {
            serverModel.findOne({id: message.guild.id}, function (err, Server) {
                if (err) return console.log(err);
                if (Server) {
                    if (typeof (Server.pmNotifications) === 'undefined' || Server.pmNotifications) {
                        Server.updatePms(false, err => {
                            if (err) return console.log(err);
                            message.reply(t('no-pm-server.success-disable', {lng:message.lang}));
                        });
                    } else {
                        Server.updatePms(true, err => {
                            if (err) return console.log(err);
                            message.reply(t('no-pm-server.success-enable', {lng:message.lang}));
                        });
                    }
                } else {
                    let server = new serverModel({
                        id: message.guild.id,
                        nsfwChannels: [],
                        lastVoiceChannel: "",
                        levelEnabled: true,
                        pmNotifications: false,
                        prefix:"!w."
                    });
                    server.save(err => {
                        if (err) return console.log(err);
                        message.reply(t('no-pm-server.success-disable', {lng:message.lang}));
                    });
                }
            });
        } else {
            message.reply(t('generic.no-permission', {lng:message.lang}));
        }
    } else {
        message.reply(t('generic.noPm', {lng:message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};