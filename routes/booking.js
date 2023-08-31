const express = require('express')
var router = express.Router()

const bookingController = require('../controllers/bookingController');

router.post('/book', bookingController.booking)

module.exports = router;