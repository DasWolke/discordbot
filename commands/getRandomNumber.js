/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'roll';
var generalHelper = require('../utility/general');
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    let number = 10;
    if (typeof (messageSplit[1]) !== 'undefined') {
        try {
            number = parseInt(messageSplit[1]);
        } catch (e) {
            return message.reply(t('roll.whole-number'));
        }
        if (isNaN(number)) {
            return message.reply(t('generic.nan'));
        }
        if (number < 1) {
            return message.reply(t('roll.negative', {number:number}));
        }
    }
    message.reply(t('roll.success', {first:generalHelper.random(1, number), second:number}));
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};