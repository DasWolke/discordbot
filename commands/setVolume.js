/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'volume';
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var voice = require('../utility/voice');
var messageHelper = require('../utility/message');
var config = require('../config/main.json');
var execute = function (message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message) || config.beta) {
            voice.setVolume(message).then(response => {
                message.reply(response);
            }).catch(message.reply);
        } else {
            message.reply(t('generic.no-permission', {lngs:message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'music'};