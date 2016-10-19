/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var ytHelper = require('../utility/youtube/helper');
var musicHelper = require('../utility/music');
var osu = require('../utility/osu');
var winston = logger.getT();
var cmd = 'qa';
var songModel = require('../DB/song');
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
        if (typeof(messageSplit[1]) === 'undefined') {
            return message.reply(t('qa.empty-search', {lngs: message.lang}));
        }
        var messageSearch = "";
        for (var a = 1; a < messageSplit.length; a++) {
            messageSearch = messageSearch + " " + messageSplit[a]
        }
        if (musicHelper.checkMedia(messageSplit[1])) {
            ytHelper.ytDlAndQueue(message, messageSearch, messageSplit);
        } else if (musicHelper.checkOsuMap(messageSplit[1])) {
            message.channel.sendMessage(t('qa.started-download', {
                lngs: message.lang,
                url: messageSplit[1],
                interpolation: {escape: false}
            }));
            songModel.findOne({url: messageSplit[1], type: {$ne: 'radio'}}, (err, Song) => {
                if (err) return console.log(err);
                if (Song) {
                    voice.addToQueue(message, Song, null, (err, reply) => {
                        if (err) return message.reply(err);
                        if (reply) {
                            message.reply(reply)
                        }
                    });
                } else {
                    osu.download(message).then(Song => {
                        voice.addToQueue(message, Song, null, (err, reply) => {
                            if (err) return message.reply(err);
                            if (reply) {
                                message.reply(reply)
                            }
                        });
                    }).catch(message.reply);
                }
            });
        } else {
            messageSearch = messageSearch.replace('-', '');
            songModel.find({
                $text: {$search: messageSearch},
                type: {$ne: 'radio'}
            }, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec((err, Songs) => {
                if (err) return console.log(err);
                if (Songs !== null && Songs.length > 0) {
                    let Song = Songs[0];
                    voice.addToQueue(message, Song, null, (err, reply) => {
                        if (err) return message.reply(err);
                        if (reply) {
                            message.reply(reply)
                        }
                    });
                } else {
                    message.reply(t('qa.nothing-found', {
                        search: messageSearch,
                        lngs: message.lang,
                        interpolation: {escape: false}
                    }));
                }
            });
        }
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: pre};