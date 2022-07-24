const { Schema, model } = require('mongoose');

const BlacklistSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        required: true
    }
});

const Blacklist = model('Blacklist', BlacklistSchema);

module.exports = Blacklist;