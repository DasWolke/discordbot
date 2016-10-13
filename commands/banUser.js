/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var winston = logger.getT();
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'ban';
var execute = function (message) {
    if (message.guild && messageHelper.hasWolkeBot(message)) {
        let user = message.mentions.users.first();
        if (user) {
            if (user.id !== message.botUser.user.id) {
                message.guild.fetchMember(user).then(member => {
                    if (member.id !== message.guild.owner.id && !messageHelper.hasWolkeBot(message, member)) {
                        member.ban(7).then(member => {
                            message.reply(t('ban.success', {user:member.user.username,lng: message.lang}));
                        }).catch(err => {
                            console.log(err.response);
                            if (err.response.statusCode === 403) {
                                message.reply(t('ban.privilege', {user:member.user.username,lng: message.lang}));
                            } else {
                                message.reply(t('ban.err', {user:member.user.username,lng: message.lang}));
                            }
                        });
                    } else {
                        message.reply(t('ban.ban-perms'));
                    }
                }).catch(console.log);
            } else {
                message.reply(t('ban.self', {lng: message.lang}));
            }
        } else {
            message.reply(t('ban.no-mention', {lng: message.lang}));
        }
    } else {
        message.reply(t('ban.no-perm', {lng: message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:1, exec:execute};