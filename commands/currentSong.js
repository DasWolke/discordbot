/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'np';
var voice = require('../utility/voice');
var execute = function (message) {
    if (message.guild) {
        voice.now(message);
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};