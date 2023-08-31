const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Booking = new Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    date: { type: Date },
    time: { type: String },
    note: { type: String },
    check: { type: Boolean, default: false },
    count: { type: Number },
    expiresAt: { type: Date, default: Date.now, expires: '30d' } // Tạo trường expiresAt với thời gian hết hạn 3 ngày
})

module.exports = mongoose.model('booking', Booking);
