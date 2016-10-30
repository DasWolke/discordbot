/**
 * Created by julia on 30.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'cr';
var exec = (message) => {
    if (message.guild) {
        let wolkebot = messageHelper.hasWolkeBot(message);
        if (wolkebot) {
            let messageSplit = message.content.split(' ').splice(1);
            let res = parseArguments(messageSplit);
            let arguments = res.arguments;
            messageSplit = res.split;
            winston.info(messageSplit);
            winston.info(JSON.stringify(arguments));
            if (messageSplit.length > 0) {
                let roleGuild = message.guild.roles.filter(r => r.name === messageSplit[0]).first();
                if (roleGuild) {
                    let role = arguments;
                } else {

                }
            } else {
                message.reply(':no_entry_sign: ');
            }
        } else {
            message.reply(t('generic.no-permission', {lngs: message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
var parseArguments = (contentSplit) => {
    let arguments = {self: false, default: false, level: -1};
    for (var i = 0; i < contentSplit.length; i++) {
        if (contentSplit[i] === '-s') {
            arguments.self = true;
            contentSplit = contentSplit.slice(i);
        }
        if ("-d" === contentSplit[i]) {
            arguments.default = true;
            contentSplit = contentSplit.slice(i);
        }
        if (contentSplit[i] === "-l") {
            let number = -1;
            if (typeof (contentSplit[i + 1]) !== 'undefined') {
                try {
                    number = parseInt(contentSplit[i + 1]);
                } catch (e) {

                }
                if (isNaN(number)) {
                    number = -1;
                }
                if (number < 2) {
                    number = -1;
                }
                arguments.level = number;
                contentSplit = contentSplit.slice(2);
            }
            contentSplit = contentSplit.slice(i);
        }
    }
    return {arguments: arguments, split: contentSplit};
};
module.exports = {cmd: cmd, accessLevel: 0, exec: exec, cat: 'role'};