/**
 * Created by julia on 06.10.2016.
 */
var cmd = 'garfield';
var general = require('../utility/general');
var moment = require('moment');
var execute = function (message) {
    let year = general.random(1990, 2016);
    let day = general.random(0, 366);
    let date = moment().year(year).dayOfYear(day);
    let dateFormat = date.format('YYYY-MM-DD');
    let dateYear = date.year();
    message.channel.sendMessage(`https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/${dateYear}/${dateFormat}.gif`).then(messageSent => {

    }).catch(console.log);
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};