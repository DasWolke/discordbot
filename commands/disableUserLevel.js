/**
 * Created by julia on 03.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'noLevel';
var userModel = require('../DB/user');
var messageHelper = require('../utility/message');
var execute = function (message) {
    if (message.guild) {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return cb(err);
            if (User) {
                if (messageHelper.hasGuild(message, User)) {
                    if (messageHelper.levelEnabled(message, User)) {
                        User.disableLevel(message.guild.id, function (err) {
                            if (err) return console.log(err);
                            message.reply(t('no-level.success-disable', {lng:message.lang}));
                        });
                    } else {
                        User.enableLevel(message.guild.id, function (err) {
                            if (err) return console.log(err);
                            message.reply(t('no-level.success-enable', {lng:message.lang}));
                        });
                    }
                } else {
                    User.addServer(messageHelper.getServerObj(message, false, false), function (err) {
                        if (err) return console.log(err);
                        message.reply(t('no-level.success-disable', {lng:message.lang}));
                    });
                }
            } else {
                messageHelper.createUser(message, false, false, function (err) {
                    if (err) return console.log(err);
                    message.reply(t('no-level.success-disable', {lng:message.lang}));
                });
            }
        });
    } else {
        message.reply(t('generic.noPm', {lng:message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};