/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var queueModel = require('../DB/queue');
var winston = logger.getT();
var cmd = 'skip';
var execute = function (message) {
    if (message.guild) {
        voteSkip(message, function (err, response) {
            if (err) {
                return message.reply(err);
            }
            message.reply(response);
        });
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
var voteSkip = function voteSkip(message, cb) {
    if (message.member.voiceChannel) {
        queueModel.findOne({server: message.guild.id}, function (err, Queue) {
            if (err) return cb(err);
            if (Queue) {
                if (Queue.songs.length > 0) {
                    if (voice.inVoice(message)) {
                        var channel = voice.getVoiceChannel(message);
                        if (channel.id === message.member.voiceChannelID) {
                            if (channel.members.size > 2) {
                                Queue.checkVote(message.author.id, function (err, found) {
                                    if (err) {
                                        winston.info(err);
                                        return cb(t('generic.error', {lngs:message.lang}));
                                    }
                                    if (!found) {
                                        Queue.updateVotes(message.author.id, function (err) {
                                            if (err) {
                                                winston.info(err);
                                                return cb(t('generic.error', {lngs:message.lang}));
                                            }
                                            Queue.reload(function (err, Queue) {
                                                if (err) return winston.info(err);
                                                if (Queue) {
                                                    var voiceMembers = channel.members.size - 1;
                                                    var votePercentage = Queue.voteSkip / voiceMembers;
                                                    if (votePercentage > 0.51) {
                                                        Queue.stopRepeat(function (err) {
                                                            if (err) return cb(err);
                                                            voice.nextSong(message, Queue.songs[0]);
                                                            cb(null, t('vskip.success-skip', {
                                                                lngs: message.lang,
                                                                title: Queue.songs[0].title,
                                                                interpolation: {escape: false}
                                                            }));
                                                        });
                                                    } else {
                                                        cb(null, t('vskip.success-add', {
                                                            lngs: message.lang,
                                                            current: (votePercentage * 100).toFixed(2),
                                                            needed: 51,
                                                            interpolation: {escape: false}
                                                        }));
                                                    }
                                                }
                                            });
                                        });
                                    } else {
                                        cb(t('vskip.dup', {lngs: message.lang, interpolation: {escape: false}}));
                                    }
                                });
                            } else {
                                Queue.stopRepeat(function (err) {
                                    if (err) return cb(err);
                                    voice.nextSong(message, Queue.songs[0]);
                                    cb(null, t('vskip.success-skip', {
                                        lngs: message.lang,
                                        title: Queue.songs[0].title,
                                        interpolation: {escape: false}
                                    }));
                                });
                            }
                        } else {
                            return cb(t('vskip.same-voice', {lngs:message.lang}));
                        }
                    } else {
                        return cb(t('generic.no-voice', {lngs:message.lang}));
                    }
                } else {
                    return cb(t('generic.no-song-in-queue', {lngs:message.lang}));
                }
            } else {
                return cb(t('generic.no-song-in-queue', {lngs:message.lang}));
            }
        });
    } else {
        return cb(t('vskip.user-no-voice', {lngs:message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};