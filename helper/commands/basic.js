/**
 * Created by julian on 16.05.2016.
 */
var config = require('../../config/main.json');
var path = require('path');
var basicCommands = function (bot, message) {
    if (message.channel.isPrivate) {
        console.log('private');
    }
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case'!w.help':
            bot.reply(message, "Hey im Wolke-Chan," +
                "your Bot for Lewd Pics from Onee.moe ^^ \n" +
                "Commands you can write:" +
                " ```!w.help --> Help \n" +
                "!w.master --> get the name of my Master \n" +
                "!w.bug --> report a Bug to my Master \n" +
                "!w.add --> add me to your server \n" +
                "!w.version --> My Version```");
            return;
        case "!w.master":
            bot.reply(message, 'My Master is @Wolke');
            return;
        case "!w.version":
            bot.reply(message, 'I am running on Version 2.0');
            return;
        case "!w.add":
            bot.reply(message, "Use this Link to add me to your Server: \<https://discordapp.com/oauth2/authorize?client_id=181218254365130752&scope=bot&permissions=0\>");
            return;
        case "!w.bug":
            if (typeof (messageSplit[1]) !== 'undefined') {
                bot.reply(message, "Your Request was send to Wolke");
                console.log(message);
                var Wolke = bot.users.get("id", config.id);
                var messageToSend = message.cleanContent.replace("!w.bug ", "You Received a bug Report from " + message.author.username + ": ");
                bot.sendMessage(Wolke, messageToSend, function (err) {
                    if (err) console.log(err);
                });
            } else {
                bot.reply(message, "You did not add a Message to send.");
            }
            return;
        case "!w.voice":
            if (message.author.voiceChannel) {
                bot.joinVoiceChannel(message.author.voiceChannel, function (err, connection) {
                    if (!err) {
                        connection.playFile('./Allahu.mp3').then(function (intent) {
                            var start = Date.now();
                            connection.setSpeaking(true);
                            console.log('test\n\n', intent);
                            intent.on("end", function () {
                                console.log("Ended!" + (Date.now() - start));
                            });
                            intent.on("error", function (err) {
                                console.log(err);
                            });
                        }).catch(function (err) {
                            console.log(err)
                        });
                    }
                });
            } else {
                bot.reply(message, "You are not in a Voice Channel!");
            }
            return;
        case "!w.silent":
            if (message.author.voiceChannel) {
                bot.leaveVoiceChannel(message.author.voiceChannel, function (err, connection) {
                    if (err) console.log(err);
                });
            }
            return;
        case "!w.test":
            console.log('testing!');
            var loop = false;
            for (var connection of bot.internal.voiceConnections) {
                if (connection) {
                    loop = true;
                    connection.playFile('https://www.myinstants.com/media/sounds/epic.swf_1.mp3').then(function (res) {
                        console.log(res);
                        res.on("end", function () {
                            console.log("Ended!");
                        });
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
            }
            if (!loop) {
                bot.reply(message, "I am not in any VoiceChannels atm.");
            } else {
                bot.reply(message, 'I work :D');
            }
            return;
        default:
            if (message.channel.isPrivate) {
                bot.reply(message, 'Sorry i did not understand that, please try help for a list of commands.');
            }
            return;
    }
};
module.exports = basicCommands;