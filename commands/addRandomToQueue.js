/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var general = require('../utility/general');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var async = require('async');
var AsciiTable = require('ascii-table');
var winston = logger.getT();
var cmd = 'rq';
var songModel = require('../DB/song');
var pre = function (message) {
    if (message.guild) {
        voice.getInVoice(message, (err, msg) => {
            if (err) return message.channel.sendMessage(err);
            execute(msg);
        });
    } else {
        message.channel.sendMessage(t('generic.no-pm', {lngs: message.lang}));
    }
};
var execute = function (message) {
    if (message.guild) {
        let messageSplit = message.content.split(' ');
        let iteration = 0;
        try {
            iteration = messageSplit[1];
        } catch (e) {
            iteration = 0;
        }
        if (isNaN(iteration)) {
            iteration = 0;
        }
        songModel.count({type: {$ne: 'radio'}}, function (err, C) {
            if (err) return message.channel.sendMessage(t('qa.db-error', {lngs: message.lang}));
            var random = general.random(0, C);
            songModel.find({type: {$ne: 'radio'}}, function (err, Songs) {
                if (err) return winston.error(err);
                let Song;
                if (iteration === 0) {
                    if (typeof(Songs[random]) !== 'undefined') {
                        Song = Songs[random];
                        if (voice.inVoice(message)) {
                            voice.addToQueue(message, Song, false, (err, result) => {
                                if (err) return message.channel.sendMessage(err);
                                message.channel.sendMessage(result);
                            });
                        } else {
                            message.channel.sendMessage(t('generic.no-voice', {lngs: message.lang}));
                        }
                    } else {
                        message.channel.sendMessage(t('generic.error', {lngs: message.lang}));
                    }
                } else if (iteration < 101) {
                    winston.info(`rq ${iteration}`);
                    if (voice.inVoice(message)) {
                        var randoms = [];
                        for (var i = 0; i < iteration; i++) {
                            random = general.random(0, Songs.length);
                            Song = Songs[random];
                            Songs.splice(random, 1);
                            randoms.push(Song);
                        }
                        let addedSongs = 0;
                        voice.addToQueueBatch(message, randoms, false, (err, addedS) => {
                            if (err) message.channel.sendMessage(err);
                            addedSongs = addedS;
                            if (addedSongs > 0) {
                                let table = new AsciiTable();
                                for (var i = 0; i < addedSongs; i++) {
                                    table.addRow(i + 1, randoms[i].title);
                                }
                                message.channel.sendMessage(t('rq.success-multiple', {
                                    table: table.toString(),
                                    lngs: message.lang,
                                    interpolation: {escape: false}
                                })).then(msg => {
                                    msg.delete(60 * 1000);
                                }).catch(winston.info);
                            }
                        });

                    } else {
                        message.channel.sendMessage(t('generic.no-voice', {lngs: message.lang}));
                    }
                } else {
                    message.channel.sendMessage(':x: :keycap_ten: :zero: :musical_note: ');
                }
            });
        });
    } else {
        message.channel.sendMessage(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: pre, cat: 'music'};