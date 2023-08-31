const authRoute = require('./auth')
const bookingRoute = require('./booking')
const reviewRoute = require('./review')
const adminRoute = require('./admin')
const hireRoute = require('./hire')
function route(app) {
    app.use('/api/auth', authRoute)
    app.use('/api/booking', bookingRoute)
    app.use('/api/review', reviewRoute)
    app.use('/api/admin', adminRoute)
    app.use('/api/hire', hireRoute)
}

module.exports = route;