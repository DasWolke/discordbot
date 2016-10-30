/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'cuddle';
var path = require('path');
var logger = require('../utility/logger');
var winston = logger.getT();
var request = require("request");
var execute = function (message) {
    request.get('https://rra.ram.moe/i/r?type=cuddle', (err, result, body) => {
        if (err) return winston.error(err);
        let parsedBody = JSON.parse(body);
        message.channel.sendMessage(`https://rra.ram.moe${parsedBody.path}`);
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};