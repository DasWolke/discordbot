/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'bot';
var moment = require('moment');
var AsciiTable = require('ascii-table');
var execute = function (message) {
    if (message.guild) {
        let table = new AsciiTable();
        let duration = moment.duration(message.botUser.uptime);
        let users = 0;
        let channels = 0;
        let averageUsers = 0;
        let averageChannels = 0;
        message.botUser.guilds.map((guild => {
            if (guild.id !== '110373943822540800') {
                users = users + guild.members.size;
                channels = channels + guild.channels.size;
            }
        }));
        averageUsers = users/message.botUser.guilds.size-1;
        averageChannels = channels/message.botUser.guilds.size-1;
        table
            .addRow('Uptime', duration.humanize())
            .addRow('Guilds', message.botUser.guilds.size-1)
            .addRow('Channels', channels)
            .addRow('Users', users)
            .addRow('Avg. Users per guild', averageUsers.toFixed(2))
            .addRow('Avg. Channels per guild', averageChannels.toFixed(2));
        message.reply(`\n\`\`\`${table.toString()}\`\`\``);
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};