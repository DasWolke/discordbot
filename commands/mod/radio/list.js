/**
 * Created by julia on 18.10.2016.
 */
/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'add';
var AsciiTable = require('ascii-table');
var songModel = require('../../../DB/song');
// var config = require('../../config/main.json');
var execute = function (message) {
    let messageSplit = message.content.split(' ').slice(3);
    let messageFormat = "";
    for (var i = 0; i < messageSplit.length; i++) {
        if (i === 0) {
            messageFormat = messageSplit[i];
        } else {
            messageFormat = messageFormat + " " + messageSplit[i];
        }
    }
    if (messageSplit.length > 0) {
        songModel.find({$text: {$search: messageFormat}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(10).exec(function (err, Radios) {
            if (err) return message.reply(err);
            let table = new AsciiTable();
            for (var i = 0; i < Radios.length; i++) {
                table.addRow(i + 1, Radios[i].title);
            }
            message.channel.sendMessage(table.toString());
        });
    } else {
        songModel.find({type: "radio"}).limit(10).exec(function (err, Radios) {
            if (err) return message.reply(err);
            let table = new AsciiTable();
            for (var i = 0; i < Radios.length; i++) {
                table.addRow(i + 1, Radios[i].title);
            }
            message.channel.sendMessage(table.toString());
        });
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};