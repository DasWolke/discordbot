/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'pause';
var voice = require('../utility/voice');
var messageHelper = require('../utility/message');
var config = require('../config/main.json');
var execute = function (message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message) || config.beta) {
            if (voice.inVoice(message)) {
                var connection = voice.getVoiceConnection(message);
                var dispatcher = voice.getDispatcher(connection);
                try {
                    dispatcher.pause();
                    message.channel.sendMessage(':play_pause: ');
                } catch (e) {
                    winston.info(e);
                    message.channel.sendMessage(t('generic.no-song-playing', {lngs: message.lang}));
                }
            } else {
                message.reply(t('generic.no-permission', {lngs: message.lang}));
            }
        } else {
            message.reply(t('generic.no-voice', {lngs: message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'music'};