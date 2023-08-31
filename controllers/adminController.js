const bookingModel = require('../model/booking')
const accountModel = require('../model/account');
const reviewModel = require('../model/review')
const mongoose = require('mongoose');

async function initializeAccount() {
    const existingAccount = await accountModel.findOne({ email: 'mixfood1708@gmail.com' });

    if (!existingAccount) {
        const newAccount = new accountModel({
            name: 'admin',
            phone: '0905473728',
            email: 'mixfood1708@gmail.com',
            password: 'T20022016V',
            isVerified: true,
            verificationCode: '123456',
            rules: true
        });
        await newAccount.save();
    }
}

(async () => {
    try {
        await initializeAccount();
    } catch (error) {
        console.error('Error initializing application:', error);
    }
})();

class adminController {
    //Account
    async getAccounts(req, res) {
    try {
        const { query } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let accounts;
        let totalCount;

        const projection = {
            name: 1,
            phone: 1,
            email: 1,
            isVerified: 1,
        };

        if (query) {
            // If there's a search query, perform the search
            accounts = await accountModel
                .find({
                    $or: [
                        { email: { $regex: query, $options: 'i' } },
                        { phone: { $regex: query, $options: 'i' } },
                    ],
                })
                .select(projection)
                .skip(skip)
                .limit(limit);

            totalCount = await accountModel.countDocuments({
                $or: [
                    { email: { $regex: query, $options: 'i' } },
                    { phone: { $regex: query, $options: 'i' } },
                ],
            });
        } else {
            // If there's no search query, fetch all accounts
            accounts = await accountModel.find().select(projection).skip(skip).limit(limit);
            totalCount = await accountModel.countDocuments();
        }

        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            page,
            limit,
            totalPages,
            totalCount,
            accounts,
        });
    } catch (error) {
        console.error('Error searching or retrieving accounts', error);
        res.status(500).json({ error: 'Server error' });
    }
}

    //Reviews
    async getReviews(req, res) {
    try {
        const { date, page, limit } = req.query;

        if (date) {
            const parsedPage = parseInt(page) || 1;
            const parsedLimit = parseInt(limit) || 10;
            const skip = (parsedPage - 1) * parsedLimit;
            const searchDate = new Date(date);
            const startDate = new Date(searchDate);
            const endDate = new Date(searchDate);
            endDate.setDate(startDate.getDate() + 1);

            const totalCount = await reviewModel.countDocuments({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            });

            const totalPages = Math.ceil(totalCount / parsedLimit);

            const reviews = await reviewModel
                .find({
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                })
                .skip(skip)
                .limit(parsedLimit)
                .sort({ createdAt: -1 });

            return res.json({
                page: parsedPage,
                limit: parsedLimit,
                totalPages,
                totalCount,
                reviews,
            });
        } else {
            const parsedPage = parseInt(page) || 1;
            const parsedLimit = parseInt(limit) || 10;
            const skip = (parsedPage - 1) * parsedLimit;

            const totalCount = await reviewModel.countDocuments();
            const totalPages = Math.ceil(totalCount / parsedLimit);

            const reviews = await reviewModel
                .find()
                .skip(skip)
                .limit(parsedLimit)
                .sort({ createdAt: -1 });

            return res.json({
                page: parsedPage,
                limit: parsedLimit,
                totalPages,
                totalCount,
                reviews,
            });
        }
    } catch (error) {
        console.error('Error retrieving reviews', error);
        res.status(500).json({ error: 'Server error' });
    }
}

    async updateReviewStatus(req, res) {
    try {
        const { _id } = req.body;
        const review = await reviewModel.findOne({ _id });
        if (review) {
            review.isShow = !review.isShow;
            await review.save();
            return res.status(200).json({ message: 'Cập nhật review thành công' });
        } else {
            return res.status(404).json({ error: 'Không tìm thấy đánh giá' });
        }
    } catch (error) {
        console.error('Error updating review status', error);
        return res.status(500).json({ error: 'Failed to update review' });
    }
}

    //Booking
    async getBookingUnchecked(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalCount = await bookingModel.countDocuments({ check: false });
        const totalPages = Math.ceil(totalCount / limit);

        const uncheckedBookings = await bookingModel
            .find({ check: false })
            .skip(skip)
            .limit(limit)
            .sort({ date: 1 });

        return res.json({
            page,
            limit,
            totalPages,
            totalCount,
            uncheckedBookings,
        });
    } catch (error) {
        console.error('Error retrieving unchecked bookings', error);
        res.status(500).json({ error: 'Server error' });
    }
}

    async getBookings(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { date } = req.query;

        if (date) {
            const parsedPage = parseInt(page) || 1;
            const parsedLimit = parseInt(limit) || 10;
            const searchDate = new Date(date);
            const startDate = new Date(searchDate);
            const endDate = new Date(searchDate);
            endDate.setDate(startDate.getDate() + 1);

            const totalCount = await bookingModel.countDocuments({
                check: true,
                date: {
                    $gte: startDate,
                    $lt: endDate,
                },
            });

            const totalPages = Math.ceil(totalCount / parsedLimit);

            const bookings = await bookingModel
                .find({
                    check: true,
                    date: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                })
                .skip(skip)
                .limit(parsedLimit)
                .sort({ date: 1, time: 1 });

            res.json({
                page: parsedPage,
                limit: parsedLimit,
                totalPages,
                totalCount,
                bookings,
            });
        } else {
            const totalCount = await bookingModel.countDocuments({ check: true });
            const totalPages = Math.ceil(totalCount / limit);

            const bookings = await bookingModel
                .find({ check: true })
                .skip(skip)
                .limit(limit)
                .sort({ date: 1, time: 1 });

            res.json({
                page,
                limit,
                totalPages,
                totalCount,
                bookings,
            });
        }
    } catch (error) {
        console.error('Error retrieving bookings', error);
        res.status(500).json({ error: 'Server error' });
    }
}

    async getUncheckedBookingCount(req, res) {
    try {
        const uncheckedCount = await bookingModel.countDocuments({ check: false });
        return res.json({ count: uncheckedCount });
    } catch (error) {
        console.error('Error fetching unchecked booking count', error);
        res.status(500).json({ error: 'Server error' });
    }
}

    async updateBookingStatus(req, res) {
    try {
        const { _id } = req.body;
        const booking = await bookingModel.findOne({ _id });

        if (booking) {
            booking.check = true;
            await booking.save();
            return res.status(200).json({ message: 'Booking confirmed successfully' });
        } else {
            return res.status(404).json({ error: 'Booking not found' });
        }
    } catch (error) {
        console.error('Error updating booking status', error);
        return res.status(500).json({ error: 'Failed to update booking' });
    }
}
}

module.exports = new adminController;