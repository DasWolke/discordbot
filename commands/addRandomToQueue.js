/**
 * Created by julia on 02.10.2016.
 */
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
            if (err) return message.reply("A Database Error occured!");
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
                            message.reply("I am not connected to any Voice Channel on this Server!");
                        }
                    } else {
                        message.reply('A Error occured!');
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
                        async.eachSeries(randoms, ((randomSong, cb) => {
                            voice.addToQueue(message, randomSong, false).then((message) => {

                                return cb();
                            }).catch(cb);
                        }), (err) => {
                            if (err) return message.reply(err);
                            let table = new AsciiTable();
                            for (var i = 0; i < randoms.length; i++) {
                                table.addRow(i+1, randoms[i].title);
                            }
                            message.reply('Added the following Songs:\n```' + table.toString() + '```');
                        });

                    }
                }
            });
        });
    } else {
        message.reply('This Command does not work in private Channels');
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};