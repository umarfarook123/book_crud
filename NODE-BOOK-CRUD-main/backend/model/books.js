const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({

    title: { type: String, default: "", index: 1 },
    author: { type: String, default: "", index: 1 },
    summary: { type: String, default: "", index: 1 },

}, { "versionKey": false }, { timestamps: true });

module.exports = mongoose.model('book', bookSchema, 'book');