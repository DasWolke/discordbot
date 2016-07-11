/**
 * Created by julia on 11.07.2016.
 */
var permissionCmd = function (bot,message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.adminRole":
            
            return;
        default:
            return;
    }
};
module.exports = permissionCmd;