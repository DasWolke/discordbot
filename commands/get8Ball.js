/**
 * Created by julia on 06.10.2016.
 */
var cmd = '8ball';
var general = require('../utility/general');
var execute = function (message) {
    var random = general.random(0, 6);
    if (random === 0) {
        message.reply('No.');
    }
    if (random === 1) {
        message.reply('Yes.');
    }
    if (random === 2) {
        message.reply('Maybe.');
    }
    if (random === 3) {
        message.reply('I would not do it.');
    }
    if (random === 4) {
        message.reply('Very bad idea.');
    }
    if (random === 5) {
        message.reply('Just do it.');
    }
    if (random === 6) {
        message.reply('That is a great idea.');
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};