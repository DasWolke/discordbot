var voice = require("../voice.js");
var async = require("async");
var general = require("../general.js");
var songModel = require('../../DB/song');
/**
 * Created by julia on 31.10.2016.
 */
var addToQueue = (iteration, cb) => {
    songModel.count({type: {$ne: 'radio'}}, function (err, C) {
        // if (err) return message.channel.sendMessage(t('qa.db-error', {lngs: message.lang}));
        var random = general.random(0, C);
        songModel.find({type: {$ne: 'radio'}}, function (err, Songs) {
            if (err) return cb(err);
            let Song;
            if (iteration === 0) {
                if (typeof(Songs[random]) !== 'undefined') {
                    Song = Songs[random];
                    voice.addToQueue(message, Song, false, (err, result) => {
                        if (err) return cb(err);
                        cb(null, result);
                    });

                } else {
                    cb({error: 'no-voice'});
                }
            } else if (iteration <= 100) {
                var randoms = [];
                for (var i = 0; i < iteration; i++) {
                    random = general.random(0, Songs.length);
                    Song = Songs[random];
                    Songs.splice(random, 1);
                    randoms.push(Song);
                }
                let addedSongs = 0;
                async.eachSeries(randoms, ((randomSong, cb) => {
                    voice.addToQueue(message, randomSong, false, (err, result) => {
                        if (err) return cb(err);
                        addedSongs = addedSongs + 1;
                        return cb();
                    });
                }), (err) => {
                    if (err) return cb(err);
                    if (addedSongs > 0) {
                        let table = new AsciiTable();
                        for (var i = 0; i < addedSongs; i++) {
                            table.addRow(i + 1, randoms[i].title);
                        }
                        // message.channel.sendMessage(t('rq.success-multiple', {
                        //     table: table.toString(),
                        //     lngs: message.lang,
                        //     interpolation: {escape: false}
                        // })).then(msg => {
                        //     msg.delete(60 * 1000);
                        // }).catch(winston.info);
                    }
                });

                {
                    return cb({error: ':x: :keycap_ten: :zero: :musical_note: '});
                }
            }

        });
    });
};