/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var general = require('../utility/general');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var queueModel = require('../DB/queue');
var winston = logger.getT();
var cmd = 'queue';
var execute = function (message) {
    if (message.guild) {
        queueModel.findOne({server: message.guild.id}, function (err, Queue) {
            if (err) return winston.info(err);
            if (Queue) {
                if (Queue.songs.length > 0) {
                    var reply = "";
                    let iteration = 20;
                    if (Queue.songs.length > 20) {

                    } else {
                        iteration = Queue.songs.length;
                    }
                    for (var q = 0; q < iteration; q++) {
                        if (q === 0) {
                            const dispatcher = voice.getDispatcher(message.guild.voiceConnection);
                            let repeat = Queue.repeat ? t('np.repeat-on', {lngs: message.lang}) : "";
                            if (typeof (Queue.songs[0].duration) !== 'undefined' && Queue.songs[0].duration !== '' && dispatcher) {
                                let time = Math.floor(dispatcher.time / 1000);
                                reply = reply + `${t('np.song-duration', {
                                        lngs: message.lang,
                                        title: Queue.songs[0].title,
                                        repeat: repeat,
                                        duration: Queue.songs[0].duration,
                                        current: general.convertSeconds(time),
                                        interpolation: {escape: false}
                                    })} \n`;
                            } else {
                                reply = reply + `${t('np.song', {
                                        lngs: message.lang,
                                        title: Queue.songs[0].title,
                                        repeat: repeat,
                                        interpolation: {escape: false}
                                    })}\n`;
                            }
                            if (Queue.songs.length > 1) {
                                reply = `${reply}${t('queue.queued', {lngs: message.lang})}\n\`\`\``;
                            }
                        } else {
                            let end = '\n';
                            if (q === Queue.songs.length - 1) {
                                end = `\`\`\``;
                            }
                            if (typeof (Queue.songs[q].duration) !== 'undefined') {
                                reply = reply + `${parseInt(q + 1)}. ${Queue.songs[q].title} ${Queue.songs[q].duration}${end}`;
                            } else {
                                reply = reply + `${parseInt(q + 1)}. ${Queue.songs[q].title}${end}`;
                            }
                        }

                    }
                    if (Queue.songs.length > 20) {
                        reply = reply + `${parseInt(21)}. ${t('generic.more', {
                                lngs: message.lang,
                                number: Queue.songs.length - 20
                            })}...\`\`\``;
                    }
                    message.channel.sendMessage(reply).then(msg => {
                        msg.delete(60 * 1000);
                    }).catch(winston.info);
                } else {
                    message.reply(t('generic.no-song-in-queue', {lngs: message.lang}));
                }
            } else {
                message.reply(t('generic.no-song-in-queue', {lngs: message.lang}));
            }
        });
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'music'};