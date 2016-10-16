/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'rank';
var execute = function (message) {
    if (message.guild) {
        message.reply(t('rank', {lngs:message.lang, interpolation: {escape: false}, link:`https://bot.ram.moe/l/${message.guild.id}`}));
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};