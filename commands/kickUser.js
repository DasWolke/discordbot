/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'kick';
var execute = function (message) {
    if (message.guild && messageHelper.hasWolkeBot(message)) {
        let user = message.mentions.users.first();
        if (user.id !== message.botUser.user.id) {
            if (user) {
                message.guild.fetchMember(user).then(member => {
                    if (member.id !== message.guild.owner.id && !messageHelper.hasWolkeBot(message, member)) {
                        member.kick().then(member => {
                            message.reply(t('kick.success', {user:member.user.username,lngs: message.lang}));
                        }).catch(err => {
                            if (err.response.statusCode === 403) {
                                message.reply(t('kick.privilege', {user:member.user.username,lngs: message.lang}));
                            } else {
                                message.reply(t('kick.err', {user:member.user.username,lngs: message.lang}));
                            }
                        });
                    } else {
                        message.reply(t('kick.perms', {lngs: message.lang}));
                    }
                }).catch(winston.info);
            } else {
                message.reply(t('kick.no-mention', {lngs: message.lang}));
            }
        } else {
            message.reply(t('kick.self', {lngs: message.lang}));
        }
    } else {
        message.reply(t('generic.no-permission', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 1, exec: execute};