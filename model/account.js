const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Account = new Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    rules: { type: Boolean, default: false }
})

module.exports = mongoose.model('account', Account);
