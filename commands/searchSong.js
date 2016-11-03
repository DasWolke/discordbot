/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var songModel = require('../DB/song');
var cmd = 'search';
var logger = require('../utility/logger');
var winston = logger.getT();
var AsciiTable = require('ascii-table');
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (typeof (messageSplit[1]) !== 'undefined') {
        var messageSearch = "";
        for (var c = 1; c < messageSplit.length; c++) {
            messageSearch = messageSearch + " " + messageSplit[c]
        }
        songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(5).exec(function (err, Songs) {
            if (err) return winston.info(err);
            if (Songs !== null && Songs.length > 0) {
                var reply = t('search.success', {lngs: message.lang}) + "\n\n";
                let table = new AsciiTable();
                for (var u = 0; u < Songs.length; u++) {
                    table.addRow(u + 1, Songs[u].title);
                }
                reply = reply + `\`\`\`${table.toString()}\`\`\``;
                message.reply(reply);
            } else {
                message.reply(t('qa.nothing-found', {search: messageSearch, lngs: message.lang}));
            }
        });
    } else {
        message.reply(t('generic.empty-search', {lngs:message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'music'};