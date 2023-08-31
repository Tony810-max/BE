const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Hire = new Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    dateOfBirth: { type: String },
    hometown: { type: String },
    note: { type: String },
    experience: { type: Boolean },
    longTime: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: Date.now, expires: '30d' },
    isCheck: { type: Boolean, default: false }
})

module.exports = mongoose.model('hire', Hire);
