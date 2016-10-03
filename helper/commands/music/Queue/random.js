/**
 * Created by julia on 29.09.2016.
 */
var songModel = require('../../../../DB/song');
var voice = require('../../../../utility/voice');
var logger = require('../../../../utility/logger');
var general = require('../../../../utility/general');
var winston = logger.getT();
var randomSongQueue = function (bot,message) {
    if (message.guild) {
        let messageSplit = message.content.split(' ');
        let iteration = 0;
        try {
            iteration = messageSplit[1];
        } catch (e) {
            iteration = 1;
        }
        if (isNaN(iteration)) {
            iteration = 1;
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
                        if (voice.inVoicemessage)) {
                            voice.addToQueuemessage, Song);
                        } else {
                            message.reply("I am not connected to any Voice Channel on this Server!");
                        }
                    } else {
                        message.reply('A Error occured!');
                    }
                } else {
                    if (voice.inVoice(bot,message)) {
                        for (var i = 0; iteration > i; i++) {
                            setTimeout(() => {
                                random = general.random(0, C);
                                Song = Songs[random];
                                voice.addToQueue(bot,message,Song, false);
                            }, 50);
                        }
                    }
                }
            });
        });
    } else {
        message.reply('This Command does not work in private Channels');
    }
};
module.exports = randomSongQueue;