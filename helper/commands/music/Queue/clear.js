/**
 * Created by julia on 29.09.2016.
 */
var AsciiTable = require('ascii-table');
var queueModel = require('../../../../DB/queue');
var messageHelper = require('../../../../utility/message');
var clear = function removeFromQueuemessage, messageSplit) {
    if(messageHelper.hasWolkeBot(message)) {
        if (typeof (messageSplit[1]) !== 'undefined' && messageSplit[1]) {
            let number = 0;
            try {
               number = parseInt(messageSplit[1]);
            } catch (e) {
               return message.reply('Please add a whole number!');
            }
            if (isNaN(number)) {
                return message.reply(`Whatever you just send, please just add a whole number. :) `);
            }
            if (number < 1) {
                return message.reply(`You cant remove ${number} songs!`);
            }
            queueModel.findOne({server: message.guild.id}, function (err, Queue) {
                if (err) return console.log(err);
                if (Queue) {
                    if (Queue.songs.length > 1) {
                        let keptSongs = Queue.songs.slice(0, Queue.songs.length - number);
                        Queue.clear(keptSongs, err => {
                            if (err) return console.log(err);
                            let songs = Queue.songs.slice(Queue.songs.length - number, Queue.songs.length);
                            message.reply(`Removed  the following Songs:\n ${buildReply(songs)}`);
                        });
                    } else if (Queue.songs.length === 1) {
                        message.reply('Use !w.skip to skip the current Song!');
                    } else {
                        message.reply('No Song in the Queue at the Moment!');
                    }
                } else {
                    message.reply('No Song in the Queue at the Moment!');
                }
            });
        } else {
            queueModel.findOne({server: message.guild.id}, function (err, Queue) {
                if (err) return console.log(err);
                if (Queue) {
                    if (Queue.songs.length > 1) {
                        let keptSongs = Queue.songs.slice(0, 1);
                        Queue.clear(keptSongs, err => {
                            if (err) return console.log(err);
                            let songs = Queue.songs.slice(1, Queue.songs.length);
                            message.reply(`Removed the following Songs:\n ${buildReply(songs)}`);
                        });
                    } else if (Queue.songs.length === 1) {
                        message.reply('Use !w.skip to skip the current Song!');
                    } else {
                        message.reply('No Song in the Queue at the Moment!');
                    }
                } else {
                    message.reply('No Song in the Queue at the Moment!');
                }
            });
        }
    } else {
        message.reply('You dont have the permission to use this Command, please add a discord role named WolkeBot to yourself to use it.');
    }
};
var buildReply = function (songs) {
    var table = new AsciiTable();
    for (var i = 0; i < songs.length; i++) {
        table.addRow(i+1, songs[i].title);
    }
    return `\`\`\`${table.toString()}\`\`\``;
};
module.exports = clear;