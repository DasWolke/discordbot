/**
 * Created by julia on 14.09.2016.
 */
var request = require('request');
var config = require('../../../config/main.json');
var sendMessage = function (username,text,token,cb) {
    var data = {
        text:text,
        username:username,
        'api_key': config.proxer_api
    };
    var options = {
        method: 'POST',
        url: 'https://proxer.me/api/v1/messenger/newconference',
        headers: {
            'cache-control': 'no-cache',
            'proxer-api-token':token
        },
        formData: data
    };
    request.post(options, function (err, res, body) {
        if (err) return cb(err);
        var parsedBody = JSON.parse(body);
        if (parsedBody.error === 0) {
            return cb(null, parsedBody);
        } else {
            return cb(parsedBody);
        }
    });
};
module.exports = sendMessage;