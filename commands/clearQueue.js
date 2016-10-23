/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var osu = require('../utility/osu');
var AsciiTable = require('ascii-table');
var queueModel = require('../DB/queue');
var winston = logger.getT();
var cmd = 'qra';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (message.guild && messageHelper.hasWolkeBot(message)) {
        if (typeof (messageSplit[1]) !== 'undefined' && messageSplit[1]) {
            let number = 0;
            try {
                number = parseInt(messageSplit[1]);
            } catch (e) {
                return message.reply(t('generic.whole-num', {lngs: message.lang}));
            }
            if (isNaN(number)) {
                return message.reply(t('generic.nan', {lngs: message.lang}));
            }
            if (number < 1) {
                return message.reply(t('qra.to-small', {lngs: message.lang, number: number}));
            }
            queueModel.findOne({server: message.guild.id}, function (err, Queue) {
                if (err) return winston.info(err);
                if (Queue) {
                    if (Queue.songs.length > 1) {
                        let keptSongs = Queue.songs.slice(0, Queue.songs.length - number);
                        Queue.clear(keptSongs, err => {
                            if (err) return winston.info(err);
                            let songs = Queue.songs.slice(Queue.songs.length - number, Queue.songs.length);
                            if (songs.length > 20) {
                                message.channel.sendMessage(t('qra.too-big', {
                                    lngs: message.lang,
                                    number: songs.length
                                }));
                            } else {
                                message.channel.sendMessage(t('qra.success', {
                                    lngs: message.lang,
                                    table: buildReply(songs),
                                    interpolation: {escape: false}
                                }));
                            }
                        });
                    } else if (Queue.songs.length === 1) {
                        message.channel.sendMessage(t('qra.one-song', {lngs: message.lang, prefix: message.prefix}));
                    } else {
                        message.channel.sendMessage(t('generic.no-song-in-queue', {lngs: message.lang}));
                    }
                } else {
                    message.channel.sendMessage(t('generic.no-song-in-queue', {lngs: message.lang}));
                }
            });
        } else {
            queueModel.findOne({server: message.guild.id}, function (err, Queue) {
                if (err) return winston.info(err);
                if (Queue) {
                    if (Queue.songs.length > 1) {
                        let keptSongs = Queue.songs.slice(0, 1);
                        Queue.clear(keptSongs, err => {
                            if (err) return winston.info(err);
                            let songs = Queue.songs.slice(1, Queue.songs.length);
                            if (songs.length > 20) {
                                message.channel.sendMessage(t('qra.too-big', {
                                    lngs: message.lang,
                                    number: songs.length
                                }));
                            } else {
                                message.channel.sendMessage(t('qra.success', {
                                    lngs: message.lang,
                                    table: buildReply(songs),
                                    interpolation: {escape: false}
                                })).then(msg => {
                                    msg.delete(60 * 1000);
                                }).catch(winston.info);
                            }
                        });
                    } else if (Queue.songs.length === 1) {
                        message.channel.sendMessage(t('qra.one-song', {lngs: message.lang, prefix: message.prefix}));
                    } else {
                        message.channel.sendMessage(t('generic.no-song-in-queue', {lngs: message.lang}));
                    }
                } else {
                    message.channel.sendMessage(t('generic.no-song-in-queue', {lngs: message.lang}));
                }
            });
        }
    } else {
        message.reply(t('generic.no-permission', {lngs: message.lang}));
    }
};
var buildReply = function (songs) {
    var table = new AsciiTable();
    for (var i = 0; i < songs.length; i++) {
        table.addRow(i + 1, songs[i].title);
    }
    return `\`\`\`${table.toString()}\`\`\``;
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};