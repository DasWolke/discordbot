/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'info';
var AsciiTable = require('ascii-table');
var execute = function (message) {
    if (message.guild) {
        let table = new AsciiTable();
        let textChannels = message.guild.channels.findAll('type', 'text').length;
        let voiceChannels = message.guild.channels.findAll('type', 'voice').length;
        table
            .addRow('ID', message.guild.id)
            .addRow('Name', message.guild.name)
            .addRow('Members', message.guild.members.size)
            .addRow('Text channels', textChannels)
            .addRow('Voice channels', voiceChannels)
            .addRow('Roles', message.guild.roles.size)
            .addRow('Creation Date', message.guild.creationDate.toDateString())
            .addRow('Region', message.guild.region)
            .addRow('Owner', `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`);
        message.reply(`\n\`\`\`${table.toString()}\`\`\``);
    } else {
        message.reply('This command only works in guilds!');
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};