/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'roll';
var generalHelper = require('../utility/general');
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    let number = 10;
    if (typeof (messageSplit[1]) !== 'undefined') {
        try {
            number = parseInt(messageSplit[1]);
        } catch (e) {
            return message.reply('Please add a whole number!');
        }
        if (isNaN(number)) {
            return message.reply(`Whatever you just send, please just add a whole number. :) `);
        }
        if (number < 1) {
            return message.reply(`I cant roll with a ${number}`);
        }
    }
    message.reply(`Rolled a ${generalHelper.random(1, number)} out of ${number}`);
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};