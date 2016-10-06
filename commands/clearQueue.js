/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var osu = require('../utility/osu');
var AsciiTable = require('ascii-table');
var queueModel = require('../DB/queue');
var winston = logger.getT();
var cmd = 'qra';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if(message.guild && messageHelper.hasWolkeBot(message)) {
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
module.exports = {cmd:cmd, accessLevel:0, exec:execute};