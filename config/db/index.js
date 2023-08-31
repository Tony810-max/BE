const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://mixfood1708:T20022016V@mixfood.gtmfikh.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

module.exports = { connect };
