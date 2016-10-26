/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'roll';
var logger = require('../utility/logger');
var winston = logger.getT();
var generalHelper = require('../utility/general');
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    let number = 10;
    if (typeof (messageSplit[1]) !== 'undefined') {
        try {
            number = parseInt(messageSplit[1]);
        } catch (e) {
            return message.reply(t('generic.whole-num', {lngs: message.lang}));
        }
        if (isNaN(number)) {
            return message.reply(t('generic.nan', {lngs: message.lang}));
        }
        if (number < 1) {
            return message.reply(t('roll.negative', {number: number, lngs: message.lang}));
        }
    }
    message.reply(t('roll.success', {first: generalHelper.random(1, number), second: number, lngs: message.lang}));
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};