/**
 * Created by julian on 16.05.2016.
 */
var config = require('../../config/main.json');
var path = require('path');
var basicCommands = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case'!w.help':
            bot.reply(message, "Hey im Wolke-Chan," +
                "your Bot for doing Stuff other bots do bad \n" +
                "Commands you can write:" +
                " ```!w.help --> Help \n" +
                "!w.master --> get the name of my Master \n" +
                "!w.bug --> report a Bug to my Master \n" +
                "!w.add --> add me to your server \n" +
                "!w.voice --> i join the Voice Channel you are currently in \n" +
                "!w.yt youtubelink --> download a Youtube Video\n" +
                "!w.osu maplink --> download a Osu Map\n" +
                "!w.play name --> Play a Song/Youtube Video\n" +
                "!w.pause --> Pause the Current Song\n" +
                "!w.resume --> Resume the pause Song\n" +
                "!w.search name --> Searches for a Song in the Bot Database and shows the 5 best Results\n" +
                "!w.skip --> Skips the Current Song\n" +
                "!w.queue name --> Adds a Song to the Queue\n" +
                "!w.queue --> Shows the current Queue\n" +
                "!w.version --> My Version```");
            return;
        case "!w.master":
            bot.reply(message, 'My Master is Wolke');
            return;
        case "!w.version":
            bot.reply(message, 'I am running on Version ' + config.version);
            return;
        case "!w.add":
            bot.reply(message, "Use this Link to add me to your Server: \<https://discordapp.com/oauth2/authorize?client_id=" + config.client_id + "&scope=bot&permissions=0\>");
            return;
        case "!w.bug":
            if (typeof (messageSplit[1]) !== 'undefined') {
                bot.reply(message, "Your Request was send to Wolke");
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
                        // connection.playFile('./audio/epic.swf_1.mp3').then(function (intent) {
                            // var start = Date.now();
                            // connection.setSpeaking(true);
                            // console.log('test\n\n', intent);
                        //     intent.on("end", function () {
                        //         console.log("File ended!");
                        //     });
                        //     intent.on("error", function (err) {
                        //         console.log(err);
                        //     });
                        // }).catch(function (err) {
                        //     console.log(err);
                        // });
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
        case "!w.wtf":
            bot.reply(message, "http://wtf.watchon.io");
            return;
        default:
            return;
    }
};
module.exports = basicCommands;