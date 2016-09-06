/**
 * Created by julia on 05.09.2016.
 */
var request = require('request');
var config = require('../../../config/main.json');
var data = {
    'username': config.proxer_user,
    'password': config.proxer_pass,
    'api_key': config.proxer_api
};
var options = {
    method: 'POST',
    url: 'http://proxer.me/api/v1/user/login',
    headers: {
        'cache-control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
    },
    formData: data
};
var login = function () {
    request.post(options, function (err, res, body) {
        if (err) return console.log(err);
        var parsedBody = JSON.parse(body);
        if (parsedBody.error === 0) {

        }
    });
};
module.exports = login;