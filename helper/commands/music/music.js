/**
 * Created by julia on 26.06.2016.
 */
var getOsu = require('./osu');
var song = require('./Song/Song.CMD');
var queueCmd = require('./Queue/Queue.CMD');
var musicCommands = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.play":
            song.play(bot, message, messageSplit);
            return;
        case "!w.np":
            song.now(bot, message);
            return;
        case "!w.osu":
            getOsu(bot, message, messageSplit[1]);
            return;
        case "!w.pause":
            song.pause(bot, message);
            return;
        case "!w.resume":
            song.resume(bot, message);
            return;
        case"!w.search":
            song.search(bot, message, messageSplit);
            return;
        case "!w.queue":
            queueCmd.main(bot, message, messageSplit);
            return;
        case "!w.q":
            queueCmd.show(bot, message);
            return;
        case "!w.qa":
            queueCmd.add(bot, message, messageSplit);
            return;
        case "!w.qrl":
            queueCmd.remove(bot, message, messageSplit);
            return;
        case "!w.forever":
            song.forever(bot, message, messageSplit);
            return;
        case "!w.skip":
            queueCmd.skip(bot, message);
            return;
        case "!w.random":
            song.random(bot, message);
            return;
        case "!w.rq":
            queueCmd.random(bot, message);
            return;
        case "!w.voteskip":
            queueCmd.voteSkip(bot, message);
            return;
        case "!w.volume":
            song.volume(bot, message);
            return;
        case "!w.qra":
            queueCmd.clear(bot,message, messageSplit);
            return;
        default:
            return;
    }
};
module.exports = musicCommands;