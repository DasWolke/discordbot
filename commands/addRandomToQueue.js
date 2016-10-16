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
        songModel.count({}, function (err, C) {
            if (err) return message.reply(t('qa.db-error', {lngs:message.lang}));
            var random = general.random(0, C);
            songModel.find({}, function (err, Songs) {
                if (err) return winston.error(err);
                let Song;
                if (iteration === 0) {
                    if (typeof(Songs[random]) !== 'undefined') {
                        Song = Songs[random];
                        if (voice.inVoice(message)) {
                            voice.addToQueue(message, Song).then(reply => {
                                message.reply(reply);
                            }).catch(message.reply);
                        } else {
                            message.reply(t('generic.no-voice', {lngs:message.lang}));
                        }
                    } else {
                        message.reply(t('generic.error', {lngs:message.lang}));
                    }
                } else {
                    if (voice.inVoice(message)) {
                        var randoms = [];
                        for (var i = 0; i < iteration; i++) {
                            random = general.random(0, Songs.length);
                            Song = Songs[random];
                            Songs.splice(random, 1);
                            randoms.push(Song);
                        }
                        let addedSongs = 0;
                        async.eachSeries(randoms, ((randomSong, cb) => {
                            voice.addToQueue(message, randomSong, false).then((message) => {
                                addedSongs = addedSongs+ 1;
                                return cb();
                            }).catch(cb);
                        }), (err) => {
                            if (err) message.reply(err);
                            if (addedSongs > 0) {
                                let table = new AsciiTable();
                                for (var i = 0; i < addedSongs; i++) {
                                    table.addRow(i + 1, randoms[i].title);
                                }
                                message.reply(t('rq.success-multiple', {table:table.toString(), lngs:message.lang, interpolation: {escape: false}}));
                            }
                        });

                    } else {
                        message.reply(t('generic.no-voice', {lngs:message.lang}));
                    }
                }
            });
        });
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};