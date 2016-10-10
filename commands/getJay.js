/**
 * Created by julia on 02.10.2016.
 */
//This is a easteregg :D
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'jay';
var execute = function (message) {
    message.reply(t('eastereggs.jay', {lng:message.lang}));
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};