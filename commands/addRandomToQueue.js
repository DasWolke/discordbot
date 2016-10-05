/**
 * Created by julia on 02.10.2016.
 */
var general = require('../utility/general');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var osu = require('../utility/osu');
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
module.exports = {cmd:cmd, accessLevel:0, exec:execute};