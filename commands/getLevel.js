/**
 * Created by julia on 03.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'level';
var serverModel = require('../DB/server');
var logger = require('../utility/logger');
var winston = logger.getT();
var messageHelper = require('../utility/message');
var levelGen = require('../utility/levelGen');
var path = require('path');
var execute = function (message) {
    levelGen((err, res) => {
        if (err) return winston.error(err);
        message.channel.sendFile(path.join(__dirname, res), '', '\u200B').then(() => {

        }).catch(winston.error);
    });
    // if (message.guild) {
    //     serverModel.findOne({id: message.guild.id}, function (err, Server) {
    //         if (err) return winston.info(err);
    //         if (Server && typeof (Server.levelEnabled) === 'undefined' || Server && Server.levelEnabled || !Server) {
    //             messageHelper.getLevel(message, (err, result) => {
    //                 if (err) return winston.info(err);
    //                 message.reply(t('level.result', {lngs:message.lang, level:result.level, current:parseInt(result.xp), needed:parseInt(messageHelper.calcXpNeeded(result)), total:result.totalXp}));
    //             });
    //         } else {
    //             message.reply(t('level.disabled',{lngs:message.lang}));
    //         }
    //     });
    // } else {
    //     message.reply(t('generic.no-pm',{lngs:message.lang}));
    // }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'user'};
//uwu