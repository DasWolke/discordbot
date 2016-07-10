/**
 * Created by julia on 10.07.2016.
 */
var mongoose = require('mongoose');
var queueSchema = mongoose.Schema({
    server:String,
    songs:[]
});
var queueModel = mongoose.model('Queues', queueSchema);
module.exports = queueModel;