const express = require('express')
var router = express.Router()

const adminController = require('../controllers/adminController');

//Reviews
router.get('/getReviews', adminController.getReviews)
router.put('/updateReview', adminController.updateReviewStatus);

//Accounts
router.get('/getAccounts', adminController.getAccounts);

//Booking
router.get('/getBookings', adminController.getBookings);
router.get('/getBookingUnchecked', adminController.getBookingUnchecked);
router.get('/getUncheckedBookingCount', adminController.getUncheckedBookingCount);
router.post('/updateBookingStatus', adminController.updateBookingStatus);

module.exports = router;