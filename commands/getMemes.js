/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'memes';
var request = require('request');
var execute = function (message) {
    request.get('https://memegen.link/api', (err, result ,body) => {
        console.log(body);
    });
};
module.exports = {cmd: cmd, accessLevel: 3, exec: execute};