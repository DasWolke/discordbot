/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var osu = require('../utility/osu');
var winston = logger.getT();
var cmd = 'fskip';
var queueModel = require('../DB/queue');
var config = require('../config/main.json');
var execute = function (message) {
    if (message.guild) {
        if (voice.inVoice(message)) {
            if (messageHelper.hasWolkeBot(message) || config.beta) {
                queueModel.findOne({server: message.guild.id}, function (err, Queue) {
                    if (err) return winston.error(err);
                    let dispatcher = voice.getDispatcher(message.guild.voiceConnection);
                    if (Queue) {
                        if (Queue.songs.length > 0) {
                            Queue.stopRepeat(function (err) {
                                if (err) return winston.error(err);
                                voice.nextSong(message, Queue.songs[0], false);
                                message.reply(t('skip.success', {lngs:message.lang, title:Queue.songs[0].title}));
                            });
                        } else {
                            if (dispatcher) {
                                dispatcher.end();
                                message.reply(t('skip.stop', {lngs:message.lang}));
                            } else {
                                message.reply(t('generic.no-song-playing', {lngs:message.lang}));
                            }
                        }
                    } else {
                        if (connection && connection.playing) {
                            connection.stopPlaying();
                            message.reply(t('skip.stop', {lngs:message.lang}));
                        } else {
                            message.reply(t('generic.no-song-in-queue', {lngs:message.lang}));
                        }
                    }
                });
            } else {
                message.reply(t('generic.no-permission', {lngs:message.lang}));
            }
        } else {
            message.reply(t('generic.no-voice', {lngs:message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};