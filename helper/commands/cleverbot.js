/**
 * Created by julia on 10.07.2016.
 */
var cleverbot = require("cleverbot.io");
var clever = new cleverbot('mo9lLBsdGON7z0GE','Tim3tVqssr7Iie1djb4dqnwlFfjcRACF');
var config = require('../../config/main.json');
var initializeBot = function(cb) {
    clever.setNick(config.client_id);
    clever.create(function (err,session) {
        if (err) return cb(err);
        cb(null, session);
    });
};
var talkCleverBot = function talkCleverBot(bot,message) {
    var re = new RegExp("<@" + bot.user.id + ">", "g");
    var messageClean = message.content.replace(re, "");
    clever.ask(messageClean, function (err,res) {
        console.log(messageClean);
        bot.reply(message, res);
    });
};
module.exports = {talk:talkCleverBot, init:initializeBot};
