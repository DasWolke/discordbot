/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var ytHelper = require('../utility/youtube/helper');
var musicHelper = require('../utility/music');
var osu = require('../utility/osu');
var winston = logger.getT();
var cmd = 'play';
var songModel = require('../DB/song');
var config = require('../config/main.json');
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
    let messageSplit = message.content.split(' ');
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message) || config.beta) {
            if (typeof (messageSplit[1]) !== 'undefined') {
                var messageSearch = "";
                for (var i = 1; i < messageSplit.length; i++) {
                    messageSearch = messageSearch + " " + messageSplit[i]
                }
                if (musicHelper.checkMedia(messageSearch)) {
                    ytHelper.ytDlAndPlayFirst(message, messageSearch, messageSplit);
                } else if (musicHelper.checkOsuMap(messageSplit[1])) {
                    osu.download(message).then(Song => {
                        if (voice.inVoice(message)) {
                            voice.addSongFirst(message, Song, false).then(() => {
                                voice.playSong(message, Song);
                            }).catch(console.log);
                        } else {
                            message.reply(t('generic.no-voice', {lngs:message.lang}));
                        }
                    }).catch(message.reply);
                } else {
                    songModel.find({
                        $text: {$search: messageSearch},
                        type: {$ne: 'radio'}
                    }, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec(function (err, Songs) {
                        if (err) return console.log(err);
                        var Song = Songs[0];
                        if (Song) {
                            if (voice.inVoice(message)) {
                                voice.addSongFirst(message, Song, false).then(() => {
                                    voice.playSong(message, Song);
                                }).catch(console.log);
                            } else {
                                message.reply(t('generic.no-voice', {lngs:message.lang}));
                            }
                        } else {
                            message.reply(t('play.no-result', {lngs:message.lang}));
                        }
                    });
                }
            } else {
                message.reply(t('generic.empty-search', {lngs:message.lang}));
            }
        } else {
            message.reply(t('generic.no-permission', {lngs:message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:pre};