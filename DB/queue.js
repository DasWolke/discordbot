/**
 * Created by julia on 10.07.2016.
 */
var mongoose = require('mongoose');
var queueSchema = mongoose.Schema({
    server:String,
    voteSkip:Number,
    voteSkipVotes:[],
    songs:[]
});
queueSchema.methods.updateVotes = function updateVotes(Id, cb) {
    this.model('Queues').update({server:this.server}, {$inc:{voteSkip:1}, $addToSet:{voteSkipVotes:Id}}, cb);
};
queueSchema.methods.resetVotes = function resetVotes(cb) {
    this.model('Queues').update({server:this.server}, {$set:{voteSkip:0, voteSkipVotes:[]}}, cb);
};
queueSchema.methods.reload = function reload(cb) {
    this.model('Queues').findOne({server:this.server}, cb);
};
queueSchema.methods.checkVote = function checkVote(Id,cb) {
    this.model('Queues').findOne({voteSkipVotes:Id, server:this.server}, function (err,Queue) {
        if (err) return cb(err);
        if (Queue) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    });
};
var queueModel = mongoose.model('Queues', queueSchema);
module.exports = queueModel;