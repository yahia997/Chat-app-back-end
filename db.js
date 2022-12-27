const mongoose = require('mongoose'); 

// data //
const messages = new mongoose.Schema({
    name: {type: String, required: true, unique: false},
    text: {type: String, required: true, unique: false},
    date: { type: String, required: true, unique: false },
    colour: { type: String, required: true, unique: false },
}, {
    timestamps: true,
});

const Messages = mongoose.model('messages', messages);

module.exports = { Messages };