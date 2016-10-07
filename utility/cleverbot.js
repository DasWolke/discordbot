/**
 * Created by julia on 10.07.2016.
 */
var Cleverbot = require("cleverbot-node");
var talkCleverBot = function talkCleverBot(message) {
    var clever = new Cleverbot;
    var re = /<@[0-9].*>/g;
    var messageClean = message.content.replace(re, "");
    Cleverbot.prepare(function(){
        clever.write(messageClean, function (response) {
            // console.log(response);
            message.reply(response.message);
        });
    });
};
module.exports = {talk:talkCleverBot};
