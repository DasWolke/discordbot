/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'pp';
var osuHelper = require('../utility/osu');
var execute = function (message) {
    osuHelper.calcPP(message, (err, result) => {
        if (err) {
            switch (err.type) {
                case "api-body":
                    message.reply(t('pp.err.api-body', {lngs:message.lang}));
                    return;
                case "osu-api":
                    message.reply(t('pp.err.osu-api', {lngs:message.lang}));
                    return;
                case "unvalid-link":
                    message.reply(t('pp.err.unvalid-link', {lngs:message.lang}));
                    return;
                case "no-link":
                    message.reply(t('pp.err.no-link', {lngs:message.lang}));
                    return;
                default:
                    return;
            }
        }
        message.reply(t('pp.success', {
            lngs: message.lang,
            interpolation: {escape: false},
            artist: result.beatmap.artist,
            title: result.beatmap.title,
            version: result.body.version,
            accuracy: result.body.acc,
            pp: result.body.pp,
            mods: result.body.mods
        }));
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};