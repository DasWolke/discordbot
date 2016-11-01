/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'about';
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var config = require('../config/main.json');
var version = require('../package.json').version;
var AsciiTable = require('ascii-table');
var execute = function (message) {
    let table = new AsciiTable();
    table
        .addRow(t('generic.version'), version)
        .addRow(t('generic.author'), 'Wolke#6746')
        .addRow(t('generic.lib'), 'Discord.js V10.0.1');
    message.channel.sendCode('', table.toString());
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'stats'};