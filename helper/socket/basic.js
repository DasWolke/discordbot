/**
 * Created by julia on 24.07.2016.
 */
var config = require('../../config/main.json');
var init = function init(socket) {
    socket.on('connect', function(){
        console.log('Connected to Socket Server!');
    });
    socket.on('connect_error', function(error){
        // console.log('Error connecting:' + error);
    });
    socket.on('disconnect', function(){
        console.log('Disconnected from Socket Server!');
    });
    socket.on('auth', function () {
        socket.emit('auth', {token:config.web_token});
    });
    socket.on('auth:success', function () {
        console.log('Authenticated Successfully with Server!');
    });
    var interval = setInterval(function () {
        socket.emit('online');
    }, 1000*10)
};
module.exports = {init:init};