/**
 * Created by julia on 14.07.2016.
 */
var i18nBean = require('../i18nManager');
var t = i18nBean.getT();
var yt = require('./youtube-child');
var voice = require('../voice');
var songModel = require('../../DB/song');
var queueModel = require('../../DB/queue');
var path = require('path');
var logger = require('../logger');
var winston = logger.getT();
var ytDlAndPlayFirst = function (message, messageSearch) {
    songModel.findOne({url: messageSearch.trim()}, function (err, Song) {
        let dispatcher;
        if (message.guild.voiceConnection) {
            dispatcher = voice.getDispatcher(message.guild.voiceConnection);
        }
        if (err) {
            winston.info(err);
            return message.channel.sendMessage(t('generic.error', {lngs: message.lang}));
        }
        if (Song) {
            if (voice.inVoice(message)) {
                queueModel.findOne({id: message.guild.id}, (err, Queue) => {
                    if (err) return winston.info(err);
                    if (Queue && Queue.songs[0].id === Song.id) {
                        message.channel.sendMessage(t('voice.already-playing'));
                    } else {
                        voice.addSongFirst(message, Song, false).then(() => {
                            try {
                                dispatcher.setVolume(0);
                            } catch (e) {

                            }
                            voice.playSong(message, Song);
                        }).catch(err => {
                            message.channel.sendMessage(err)
                        });
                    }
                });
            } else {
                message.channel.sendMessage(t('generic.no-voice', {lngs: message.lang}));
            }
        } else {
            message.channel.sendMessage(t('voice.dl-start', {lngs: message.lang}));
            yt.download(messageSearch.trim(), message, function (err, info) {
                if (err) {
                    return message.channel.sendMessage(t('voice.blocked', {lngs: message.lang}));
                }
                message.channel.sendMessage(t('qa.success', {lngs: message.lang, song: info.title}));
                songModel.findOne({id: info.id, type: {$ne: 'radio'}}, function (err, Song) {
                    if (err) return winston.info(err);
                    if (Song) {
                        if (voice.inVoice(message)) {
                            voice.addSongFirst(message, Song, false).then(() => {
                                try {
                                    dispatcher.setVolume(0);
                                } catch (e) {

                                }
                                voice.playSong(message, Song);
                            }).catch(err => {
                                message.channel.sendMessage(err)
                            });
                        } else {
                            message.channel.sendMessage(t('generic.no-voice', {lngs: message.lang}));
                        }
                    } else {
                        message.channel.sendMessage(t('generic.error', {lngs: message.lang}));
                    }
                });
            });
        }
    });
};
var ytDlAndQueue = function (message, messageSearch, messageSplit) {
    songModel.findOne({url: messageSearch.trim(), type: {$ne: 'radio'}}, function (err, Song) {
        if (err) {
            winston.info(err);
            return message.channel.sendMessage(t('generic.error', {lngs: message.lang}));
        }
        if (Song) {
            if (voice.inVoice(message)) {
                voice.addToQueue(message, Song, null, (err, reply) => {
                    if (err) return message.channel.sendMessage(err);
                    if(reply) {
                        message.channel.sendMessage(reply)
                    }
                });
            } else {
                message.channel.sendMessage(t('generic.no-voice', {lngs: message.lang}));
            }
        } else {
            message.channel.sendMessage(t('voice.dl-start', {lngs: message.lang}));
            yt.download(messageSearch.trim(), message, function (err, info) {
                if (err) {
                    return message.channel.sendMessage(t('voice.blocked', {lngs: message.lang}));
                }
                songModel.findOne({id: info.id}, function (err, Song) {
                    if (err) return winston.info(err);
                    if (Song) {
                        if (voice.inVoice(message)) {
                            voice.addToQueue(message, Song, null, (err, reply) => {
                                if (err) return message.channel.sendMessage(err);
                                if(reply) {
                                    message.channel.sendMessage(reply)
                                }
                            });
                        } else {
                            message.channel.sendMessage(t('generic.no-voice', {lngs: message.lang}));
                        }
                    } else {
                        message.channel.sendMessage(t('generic.error', {lngs: message.lang}));
                    }
                });
            });
        }
    });
};
var ytDlAndPlayForever = function (message, messageSearch) {
    songModel.findOne({url: messageSearch.trim(), type: {$ne: 'radio'}}, function (err, Song) {
        if (err) {
            winston.info(err);
            return message.channel.sendMessage(t('generic.error', {lngs: message.lang}));
        }
        if (Song) {
            if (voice.inVoice(message)) {
                voice.queueAddRepeat(message, Song);
            } else {
                message.channel.sendMessage(t('generic.no-voice', {lngs: message.lang}));
            }
        } else {
            message.channel.sendMessage(t('voice.dl-start', {lngs: message.lang}));
            yt.download(messageSearch.trim(), message, function (err, info) {
                if (err) {
                    return message.channel.sendMessage(t('voice.blocked', {lngs: message.lang}));
                }
                message.channel.sendMessage(t('qa.success', {lngs: message.lang, song: info.title}));
                songModel.findOne({id: info.id}, function (err, Song) {
                    if (err) return winston.info(err);
                    if (Song) {
                        if (voice.inVoice(message)) {
                            voice.queueAddRepeat(message, Song);
                        } else {
                            message.channel.sendMessage(t('generic.no-voice', {lngs: message.lang}));
                        }
                    } else {
                        message.channel.sendMessage(t('generic.error', {lngs: message.lang}));
                    }
                });
            });
        }
    });
};
module.exports = {
    ytDlAndPlayFirst: ytDlAndPlayFirst,
    ytDlAndPlayForever: ytDlAndPlayForever,
    ytDlAndQueue: ytDlAndQueue
};