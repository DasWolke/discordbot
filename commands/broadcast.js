/**
 * Created by julia on 02.10.2016.
 */
var async = require('async');
var cmd = 'broadcast';
var config = require('../config/main.json');
var execute = function (message) {
    if (message.author.id === config.owner_id) {
        let content = message.content.substr(message.prefix.length + cmd.length).trim();
        let guilds = message.botUser.guilds.array();
        async.eachSeries(guilds, (guild, cb) => {
            if (guild.id !== '110373943822540800') {
                guild.defaultChannel.sendMessage(content).then(message => {
                    cb();
                }).catch(err => {
                    console.log(err);
                    cb();
                });
            } else {
                async.setImmediate(() => {
                    cb();
                });
            }
        }, (err) => {
            if (err) return console.log(err);
            message.reply(`Sent broadcast to ${guilds.length-1} Guilds`);
        });
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};