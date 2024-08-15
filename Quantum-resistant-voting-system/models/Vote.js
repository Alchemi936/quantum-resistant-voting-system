const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    candidate: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;
