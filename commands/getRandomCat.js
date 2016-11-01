/**
 * Created by julia on 06.10.2016.
 */
var cmd = 'cat';
var request = require('request');
var logger = require('../utility/logger');
var winston = logger.getT();
var execute = function (message) {
    request.get('http://random.cat/meow', (err, response, body) => {
        if (err) return winston.info(err);
        let parsedBody = JSON.parse(body);
        let url = parsedBody.file.replace('\\', 'g');
        message.channel.sendMessage(url);
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};