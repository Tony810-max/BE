const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Review = new Schema({
    name: { type: String },
    phone: { type: String },
    isGood: { type: Boolean },
    title: { type: String },
    rating: { type: String },
    isShow: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    product: { type: String }
})

module.exports = mongoose.model('review', Review);
