/**
 * Created by julia on 06.10.2016.
 */
var cmd = '8ball';
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var general = require('../utility/general');
var execute = function (message) {
    let content = message.content.substr(message.prefix.length + cmd.length).trim();
    if (content && content !== '') {
        var random = general.random(0, 7);
        message.reply(t(`8ball.answers.${random}`, {lngs:message.lang}));
    } else {
        message.reply(t(`8ball.no-message`, {lngs:message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};