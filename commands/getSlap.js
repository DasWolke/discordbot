/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'slap';
var lewd = require('../config/lewd.json');
var path = require('path');
var logger = require('../utility/logger');
var winston = logger.getT();
var execute = function (message) {
    //TODO remove when fixed
    message.channel.sendFile(path.join(__dirname, '../Resources/slap.gif'), '', '\u200B').then(message => {

    }).catch(winston.info);
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};