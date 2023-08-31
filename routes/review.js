const express = require('express')
var router = express.Router()

const reviewController = require('../controllers/reviewController');

router.get('/reviewsToShow', reviewController.getReviewsToShow);

router.post('/send-review', reviewController.review)

module.exports = router;