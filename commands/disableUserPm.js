/**
 * Created by julia on 03.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'noPm';
var userModel = require('../DB/user');
var messageHelper = require('../utility/message');
var logger = require('../utility/logger');
var winston = logger.getT();
var execute = function (message) {
    if (message.guild) {
        userModel.findOne({id: message.author.id}, function (err, User) {
            if (err) return cb(err);
            if (User) {
                if (messageHelper.pmNotifications(message, User)) {
                    User.disablePm(message.guild.id, function (err) {
                        if (err) return winston.info(err);
                        message.reply(t('no-pm.success-disable', {lngs:message.lang}));
                    });
                } else {
                    User.enablePm(message.guild.id, function (err) {
                        if (err) return winston.info(err);
                        message.reply(t('no-pm.success-enable', {lngs:message.lang}));
                    });
                }
            } else {
                messageHelper.createUser(message, true, false, function (err) {
                    if (err) return winston.info(err);
                    message.reply(t('no-pm.success-disable', {lngs:message.lang}));
                });
            }
        });
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'user'};