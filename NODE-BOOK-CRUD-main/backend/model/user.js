const mongoose = require("mongoose");

const user = new mongoose.Schema({

    email: { type: String, default: "", lowerCase: true, index: 1 },
    password: { type: String, default: "" },
    books: { type: Array, default: [] }
}, { "versionKey": false }, { timestamps: true });

module.exports = mongoose.model('user', user, 'user');