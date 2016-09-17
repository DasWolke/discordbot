/**
 * Created by julia on 14.09.2016.
 */
var request = require('request');
var config = require('../../../../config/main.json');
var getUserInfo = function (id,token,cb) {
    var data = {
        user_id:id,
        'api_key': config.proxer_api
    };
    var options = {
        method: 'POST',
        url: 'https://proxer.me/api/v1/messenger/userinfo',
        headers: {
            'cache-control': 'no-cache',
            'proxer-api-token':token
        },
        formData: data
    };
    request.post(options, function (err, res, body) {
        if (err) return cb(err);
        var parsedBody = JSON.parse(body);
        if (parsedBody.error === 0 && typeof (parsedBody.data) !== 'undefined') {
            return cb(null, parsedBody.data);
        } else {
            return cb(parsedBody, null);
        }
    });
};
module.exports = getUserInfo;