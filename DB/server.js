/**
 * Created by julia on 26.06.2016.
 */
var mongoose = require('mongoose');
var serverSchema = mongoose.Schema({
    id:String,
    permissions:[],
    prefix:String,
    disabledCmds:[],
    Groups:[],
    Blacklist:[]
});
var serverModel = mongoose.model('Servers', serverSchema);
module.exports = serverModel;