/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'pl';
var execute = function (message) {
    let messageSplit = message.content.split(' ').slice(1);
    if (messageSplit.length > 0) {
        switch (messageSplit[0]) {
            case "create":
                return;
            case "import":
                return;
            case "top":
                return;
            case "list":
                return;
            case "server":
                return;
            case "remove":
                return;
            default:

                return;
        }
    } else {
        message.reply('What do you want to do ?');
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};