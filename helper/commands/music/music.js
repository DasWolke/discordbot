/**
 * Created by julia on 26.06.2016.
 */
var yt = require('../../youtube/youtube');
var songModel = require('../../../DB/song');
var Discord = require("discord.js");
var path = require('path');
var getOsu = require('./osu');
var musicCommands = function (bot, message, nowPlaying) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.yt":
            if (typeof (messageSplit[1]) !== 'undefined') {
                bot.reply(message, 'Started Downloading Video');
                yt(messageSplit[1], message, function (err, info) {
                    if (err) {
                        console.log(err);
                        return bot.reply(message, 'This is not a Valid Url!');
                    }
                    bot.reply(message, 'Finished Downloading ' + info.title);
                });
            } else {
                bot.reply(message, "No YT Link found!");
            }
            return;
        case "!w.play":
            if (!message.channel.isPrivate) {
                if (typeof (messageSplit[1]) !== 'undefined') {
                    var messageSearch = "";
                    for (var i = 1;i < messageSplit.length;i++) {
                        messageSearch = messageSearch + " " + messageSplit[i]
                    }
                    console.log(messageSearch);
                    songModel.findOne({$text: {$search: messageSearch}}, function (err, Song) {
                        if (err) return console.log(err);
                        if (Song) {
                            // console.log(message);
                            let found = false;
                            for (let channel of message.server.channels) {
                                if (channel instanceof Discord.VoiceChannel) {
                                    for (let connection of bot.internal.voiceConnections) {
                                        if (connection.voiceChannel.equals(channel)) {
                                            found = true;
                                            connection.playFile(path.resolve(Song.path)).then(function (intent) {
                                                bot.reply(message, "Now playing Song: " + Song.title);
                                                intent.on("end", function () {
                                                    console.log("File ended!");
                                                });
                                                intent.on("error", function (err) {
                                                    console.log(err);
                                                });
                                            }).catch(function (err) {
                                                console.log(err);
                                            });
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                                    }
                                }
                            }
                        } else {
                            bot.reply(message, "No Song found with Name " + messageSplit[1] + " trying to download it.");
                            yt(messageSplit[1], message, function (err, info) {
                                if (err) {
                                    console.log(err);
                                    return bot.reply(message, "No Song found with Name " + messageSplit[1]);
                                }
                                bot.reply(message, 'Found Song and Downloaded it! ' + info.title);
                                found = false;
                                songModel.findOne({id:info.id}, function (err, Song) {
                                    if (err) return console.log(err);
                                    if (Song) {
                                        for (let channel of message.server.channels) {
                                            if (channel instanceof Discord.VoiceChannel) {
                                                for (let connection of bot.internal.voiceConnections) {
                                                    if (connection.voiceChannel.equals(channel)) {
                                                        found = true;
                                                        connection.playFile(path.resolve(Song.path)).then(function (intent) {
                                                            bot.reply(message, "Now playing Song: " + Song.title);
                                                            intent.on("end", function () {
                                                                console.log("File ended!");
                                                            });
                                                            intent.on("error", function (err) {
                                                                console.log(err);
                                                            });
                                                        }).catch(function (err) {
                                                            console.log(err);
                                                        });
                                                        break;
                                                    }
                                                }
                                                if (!found) {
                                                    bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                                                }
                                            }

                                        }
                                    } else {
                                        bot.reply(message, 'Seems like a Error happened...');
                                    }
                                });
                            });
                        }
                    });
                } else {
                    bot.reply(message, 'No Search term entered!');
                }
            } else {
                bot.reply(message, "This Commands Only Works in Server Channels!");
            }
            return;
        case "!w.osu":
            getOsu(bot, message, messageSplit[1]);
            return;
        case "!w.pause":
            if (!message.channel.isPrivate) {
                let found = false;
                for (let channel of message.server.channels) {
                    if (channel instanceof Discord.VoiceChannel) {
                        for (let connection of bot.internal.voiceConnections) {
                            if (connection.voiceChannel.equals(channel)) {
                                found = true;
                                if (!connection.playing) {
                                    return bot.reply(message, "No Song is playing at the Moment");
                                }
                                try {
                                    connection.pause();
                                } catch (e) {
                                    bot.reply(message, "No Song playing at the Moment!");
                                }
                                break;
                            }
                        }
                        if (!found) {
                            bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                        }
                    }
                }
            } else {
                bot.reply(message, "This Commands Only Works in Server Channels!");
            }
            return;
        case "!w.resume":
            if (!message.channel.isPrivate) {
                let found = false;
                for (let channel of message.server.channels) {
                    if (channel instanceof Discord.VoiceChannel) {
                        for (let connection of bot.internal.voiceConnections) {
                            if (connection.voiceChannel.equals(channel)) {
                                found = true;
                                if (connection.playing) {
                                    return bot.reply(message, "A Song is playing at the Moment!");
                                }
                                try {
                                    connection.resume();
                                } catch (e) {
                                    bot.reply(message, "No Song playing at the Moment!");
                                }
                                break;
                            }
                        }
                        if (!found) {
                            bot.reply(message, 'It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                        }
                    }
                }
            } else {
                bot.reply(message, "This Commands Only Works in Server Channels!");
            }
            return;
        default:
            return;
    }
};
module.exports = musicCommands;