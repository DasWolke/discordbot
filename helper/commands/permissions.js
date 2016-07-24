/**
 * Created by julia on 11.07.2016.
 */
var permissionCmdParse = require('./permissions/basic');
var permissionCmd = function (bot,message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.perm":
            permissionCmd(bot,message);
            return;
        case "!w.permissions":
            permissionCmd(bot,message);
            return;
        default:
            return;
    }
};
module.exports = permissionCmd;