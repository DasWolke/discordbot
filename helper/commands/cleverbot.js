/**
 * Created by julia on 10.07.2016.
 */
var Cleverbot = require("cleverbot-node");
var clever = new Cleverbot;
var config = require('../../config/main.json');
var talkCleverBot = function talkCleverBot(bot,message) {
    var re = new RegExp("<@" + bot.user.id + ">", "g");
    var messageClean = message.content.replace(re, "");
    Cleverbot.prepare(function(){
        clever.write(messageClean, function (response) {
            console.log(response);
            bot.reply(message, response.message);
        });
    });
};
module.exports = {talk:talkCleverBot};
