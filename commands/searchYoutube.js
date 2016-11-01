/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'yts';
var yt = require('../utility/youtube/youtube');
var execute = function (message) {
    yt.search(message, function (err, Result) {
        if (err) {
            message.reply(err);
        } else {
            message.reply(t('yts.success', {lngs:message.lang, link:Result.link, interpolation:{escape:false}}));
        }
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'music'};