/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'rm';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (message.guild && messageHelper.hasWolkeBot(message)) {
        if (typeof (messageSplit[1]) !== 'undefined') {
            var number = 0;
            try {
                number = parseInt(messageSplit[1]);
            } catch (e) {
                return message.reply('Could not parse the Number !');
            }
            if (number > 100) {
                message.reply('You can not delete more than 100 Messages at once!');
            } else {
                message.channel.fetchMessages({before: message.id, limit: number}).then(messages => {
                    message.channel.bulkDelete(messages).then(messages => {
                        message.reply(`Successfully deleted ${number} messages`);
                    }).catch(err => {
                        message.reply('Error while trying to delete Messages!');
                        console.log(err);
                    });
                }).catch(console.log);
            }
        } else {
            message.reply('No Number of Messages to delete provided!');
        }
    } else {
        message.reply('You need the WolkeBot Role to use this Command.');
    }
};
module.exports = {cmd:cmd, accessLevel:1, exec:execute};