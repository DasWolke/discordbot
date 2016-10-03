/**
 * Created by julia on 24.07.2016.
 */
var permissionCommands = function permissionCommands(message) {
    var messageSplit = message.content.split(' ');
            if (messageSplit[1] === "create") {

            }
            if (messageSplit[1] === "add") {

            }
            if (messageSplit[1] === "edit") {

            }
            if (messageSplit[1] === "remove") {

            }
            if (messageSplit[1] === "help") {

            }
            if (!messageSplit[1]) {
                var reply = 'What do you want to do ?\n\n' +
                    '- `!w.perm create name` creates a Playlist with the given Name\n\n';
                message.reply(reply);
            }

};
module.exports = permissionCommands;