/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'rm';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message)) {
            if (typeof (messageSplit[1]) !== 'undefined') {
                var number = 0;
                try {
                    number = parseInt(messageSplit[1]);
                } catch (e) {
                    return message.reply(t('generic.nan', {lngs: message.lang}));
                }
                if (isNaN(number)) {
                    return message.reply(t('generic.nan', {lngs: message.lang}));
                }
                if (number < 2) {
                    return message.reply(t('rm.less-2', {lngs: message.lang}));
                }
                if (number > 100) {
                    return message.reply(t('rm.over-100', {lngs: message.lang}));
                } else {
                    message.channel.fetchMessages({before: message.id, limit: number}).then(messages => {
                        message.channel.bulkDelete(messages).then(() => {
                            message.reply(t('rm.success', {lngs: message.lang, number: number}));
                        }).catch(err => {
                            message.reply(t('rm.error', {lngs: message.lang}));
                            winston.error(err);
                        });
                    }).catch(winston.error);
                }
            } else {
                message.reply(t('generic.whole-num', {lngs: message.lang}));
            }
        } else {
            message.reply(t('generic.no-permission', {lngs: message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 1, exec: execute, cat: 'moderation'};