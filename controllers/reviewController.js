const reviewModel = require('../model/review')

class reviewController {
    //get
    async getReviewsToShow(req, res) {
        try {
            const reviewsToShow = await reviewModel.find({ isShow: true });
            res.status(200).json(reviewsToShow);
        } catch (error) {
            console.error('Error retrieving reviews', error);
            res.status(500).json({ error: 'Failed to retrieve reviews' });
        }
    }

    //post
    async review(req, res) {
        try {
            const { name, isGood, phone, title, rating, product } = req.body;
            const newReview = new reviewModel({ name, phone, isGood, title, rating, product });
            const savedBooking = await newReview.save();
            res.status(200).json(savedBooking);
        } catch (error) {
            console.error('Error review', error);
            res.status(500).json({ error: 'Failed to create review' });
        }
    }
}

module.exports = new reviewController;