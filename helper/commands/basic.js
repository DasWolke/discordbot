/**
 * Created by julian on 16.05.2016.
 */
var config = require('../../config/main.json');
var path = require('path');
var voice = require('../utility/voice');
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
                "!w.list --> Lists all Songs that are currently added to the Bot Database\n" +
                "!w.yt youtubelink --> download a Youtube Video\n" +
                "!w.yts query --> Searches Youtube and gives you the First Result\n" +
                "!w.osu maplink --> download a Osu Map\n" +
                "!w.play name --> Play a Song/Youtube Video\n" +
                "!w.pause --> Pause the Current Song\n" +
                "!w.resume --> Resume the pause Song\n" +
                "!w.search name --> Searches for a Song in the Bot Database and shows the 5 best Results\n" +
                "!w.skip --> Skips the Current Song\n" +
                "!w.queue name --> Adds a Song/Youtube Video to the Queue\n" +
                "!w.queue --> Shows the current Queue\n" +
                "!w.rqueue --> Adds a random Song to the Queue\n" +
                "!w.random --> Plays a Random Song\n" +
                "If you want to talk with me @mention me with a message :D \n" +
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
        case "!w.list":
            bot.reply(message, 'The List of Songs can be found at <http://w.onee.moe>');
            return;
        case "!w.voice":
            if (message.author.voiceChannel) {
                var admin = false;
                for (var role of message.server.rolesOfUser(message.author)) {
                    if (role.name === 'WolkeBot') {
                        admin = true;
                    }
                }
                if (message.server.id === '118689714319392769' && admin || message.server.id !== '118689714319392769') {
                    bot.joinVoiceChannel(message.author.voiceChannel, function (err, connection) {
                        if (!err) {
                            voice.startQueue(bot,message);
                        } else {
                            console.log(err);
                            bot.reply(message, 'An Error has occured while trying to join Voice!');
                        }
                    });
                } else {
                    bot.reply(message, 'No Permission!');
                }
            } else {
                bot.reply(message, "You are not in a Voice Channel!");
            }
            return;
        case "!w.silent":
            var admin = false;
            for (var role of message.server.rolesOfUser(message.author)) {
                if (role.name === 'WolkeBot') {
                    admin = true;
                }
            }
            if (voice.inVoice(bot,message)) {
                if (message.server.id === '118689714319392769' && admin || message.server.id !== '118689714319392769') {
                    bot.leaveVoiceChannel(message.author.voiceChannel, function (err, connection) {
                        if (err) console.log(err);
                    });
                } else {
                    bot.reply(message, 'No Permission!');
                }
            } else {
                console.log('No Voice!');
            }
            return;
        case "!w.wtf":
            bot.reply(message, "http://wtf.watchon.io");
            return;
        case "!w.stats":
            var plural;
            if (bot.servers.length > 1) {
                plural = 'servers';
            } else {
                plural = 'server';
            }
            bot.reply(message, "I am currently used on " + bot.servers.length + " " + plural);
            return;
        default:
            return;
    }
};
module.exports = basicCommands;