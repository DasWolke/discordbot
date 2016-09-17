/**
 * Created by julia on 05.09.2016.
 */
var proxer = function proxerCommands(bot, message) {
    var messageSplit = message.content.split(' ');
    var verifyCode = require('./proxer/codeVerify');
    var register = require('./proxer/register');
    switch (messageSplit[0]) {
        case "!w.pr.reg":
            register(message, messageSplit);
            return;
        case "!w.pr.code":
            verifyCode(message,messageSplit);
            return;
        default:
            return;
    }
};
module.exports = proxer;