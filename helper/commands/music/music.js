/**
 * Created by julia on 26.06.2016.
 */
var song = require('./Song/Song.CMD');
var queueCmd = require('./Queue/Queue.CMD');
var musicCommands = function (message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.play":
            song.play(message, messageSplit);
            return;
        case "!w.np":
            song.now(message);
            return;
        case "!w.pause":
            song.pause(message);
            return;
        case "!w.resume":
            song.resume(message);
            return;
        case"!w.search":
            song.search(message, messageSplit);
            return;
        case "!w.queue":
            queueCmd.main(message, messageSplit);
            return;
        case "!w.q":
            queueCmd.show(message);
            return;
        case "!w.qa":
            queueCmd.add(message, messageSplit);
            return;
        case "!w.qrl":
            queueCmd.remove(message, messageSplit);
            return;
        case "!w.forever":
            song.forever(message, messageSplit);
            return;
        case "!w.skip":
            queueCmd.skip(message);
            return;
        case "!w.random":
            song.random(message);
            return;
        case "!w.rq":
            queueCmd.random(message);
            return;
        case "!w.voteskip":
            queueCmd.voteSkip(message);
            return;
        case "!w.volume":
            song.volume(message);
            return;
        case "!w.qra":
            queueCmd.clear(bot,message, messageSplit);
            return;
        default:
            return;
    }
};
module.exports = musicCommands;