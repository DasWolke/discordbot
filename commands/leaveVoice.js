/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'leave';
var execute = function (message) {
    if (message.guild) {
        if (voice.inVoice(message)) {
            var channel = voice.getVoiceChannel(message);
            if (messageHelper.hasWolkeBot(message)) {
                channel.leave();
                voice.clearVoice(message, function (err) {
                    if (err) return winston.warn(err);
                    message.reply(t('leave', {lngs:message.lang}));
                });
            } else {
                message.reply(t('generic.no-permission', {lngs:message.lang}));
            }
        } else {
            message.reply(t('generic.no-voice', {lngs:message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};