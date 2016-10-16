/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'ytq';
var voice = require('../utility/voice');
var yt = require('../utility/youtube/youtube');
var ytHelper = require('../utility/youtube/helper');
var pre = function (message) {
    if (message.guild) {
        voice.getInVoice(message, (err, msg) => {
            if (err) return message.reply(err);
            execute(msg);
        })
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
var execute = function (message) {
    if (message.guild) {
        yt.search(message, function (err, Result) {
            if (err) {
                message.reply(err);
            } else {
                ytHelper.ytDlAndQueue(message, Result.link, ['lel', Result.link]);
            }
        });
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:pre};