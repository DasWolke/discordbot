/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'bot';
var moment = require('moment');
var AsciiTable = require('ascii-table');
var execute = function (message) {
    if (message.guild) {
        let table = new AsciiTable();
        let duration = moment.duration(message.botUser.uptime);
        let users = 0;
        let channels = 0;
        message.botUser.guilds.map((guild => {
            if (guild.id !== '110373943822540800') {
                users = users + guild.members.size;
                channels = channels + guild.channels.size;
            }
        }));
        table
            .addRow('Uptime', duration.humanize())
            .addRow('Guilds', message.botUser.guilds.size)
            .addRow('Channels', channels)
            .addRow('Users', users);
        message.reply(`\n\`\`\`${table.toString()}\`\`\``);
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};