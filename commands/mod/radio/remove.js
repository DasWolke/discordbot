/**
 * Created by julia on 18.10.2016.
 */
/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'remove';
var AsciiTable = require('ascii-table');
var messageHelper = require('../../../utility/message');
var MessageCollector = require('discord.js').MessageCollector;
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
    songModel.find({$text: {$search: messageFormat}}).limit(5).exec((err, Radios) => {
        if (err) return message.reply(err);
        if (Radios.length > 0) {
            let table = new AsciiTable();
            for (var i = 0; i < Radios.length; i++) {
                table.addRow(i + 1, Radios[i].title);
            }
            table.addRow('c', 'use c to cancel the delete!');
            message.channel.sendMessage(table.toString());
            let collector = new MessageCollector(message.channel, messageHelper.filterSelection, {max: 1});
            collector.on('end', (collection, reason) => {
                let msg = collection.first();
                let number = 10;
                try {
                    number = parseInt(msg.content)
                } catch (e) {

                }
                if (!isNaN(number) && number <= Radios.length) {
                    songModel.remove({id: Radios[number - 1].id}, (err) => {
                        if (err) return message.reply(err);
                        message.reply(`Now deleting ${Radios[number - 1].title} !`);
                    });
                }
            });
        }
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};