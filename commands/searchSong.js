/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var songModel = require('../DB/song');
var cmd = 'search';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (typeof (messageSplit[1]) !== 'undefined') {
        var messageSearch = "";
        for (var c = 1; c < messageSplit.length; c++) {
            messageSearch = messageSearch + " " + messageSplit[c]
        }
        songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(5).exec(function (err, Songs) {
            if (err) return console.log(err);
            if (Songs !== null && Songs.length > 0) {
                var reply = t('search.success', {lngs: message.lang}) + "\n\n";
                for (var x = 0; x < Songs.length; x++) {
                    reply = reply + parseInt(x + 1) + ": ```" + Songs[x].title + "```\n\n";
                }
                message.reply(reply);
            } else {
                message.reply(t('qa.nothing-found', {search: messageSearch, lngs: message.lang}));
            }
        });
    } else {
        message.reply(t('generic.empty-search', {lngs:message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};