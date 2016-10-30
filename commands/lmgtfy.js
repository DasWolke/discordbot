/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'lmg';
var logger = require('../utility/logger');
var winston = logger.getT();
var config = require('../config/main.json');
var execute = function (message) {
    let content = message.content.substr(message.prefix.length + cmd.length).trim();
    if (content !== '') {
        message.channel.sendMessage(`<http://lmgtfy.com/?q=${encodeURI(content)}>`);
    } else {
        message.channel.sendMessage(t('generic.empty-search', {lngs: message.lang}))
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};