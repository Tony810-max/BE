const hireModel = require('../model/hire')
const mongoose = require('mongoose')

class hireController {
    async createHire(req, res) {
        try {
            const formData = req.body;
            const newHire = new hireModel(formData);
            const savedHire = await newHire.save();

            return res.status(200).json(savedHire);
        } catch (error) {
            console.error('Error creating hire', error);
            res.status(500).json({ error: 'Failed to create hire' });
        }
    }

    async getAllHires(req, res) {
        try {
            const { query } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            let hires;
            let totalCount;

            if (query) {
                hires = await hireModel
                    .find({
                        $or: [
                            { name: { $regex: query, $options: 'i' } },
                            { phone: { $regex: query, $options: 'i' } },
                            { email: { $regex: query, $options: 'i' } },
                        ],
                    })
                    .skip(skip)
                    .limit(limit);

                totalCount = await hireModel.countDocuments({
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { phone: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } },
                    ],
                });
            } else {
                hires = await hireModel.find().skip(skip).limit(limit);
                totalCount = await hireModel.countDocuments();
            }

            const totalPages = Math.ceil(totalCount / limit);

            return res.json({
                page,
                limit,
                totalPages,
                totalCount,
                hires,
            });
        } catch (error) {
            console.error('Error searching or retrieving hires', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async confirmHire(req, res) {
        try {
            const { id } = req.params;

            const hire = await hireModel.findById(id);

            if (!hire) {
                return res.status(404).json({ error: 'Hire not found' });
            }

            hire.isCheck = true;

            const updatedHire = await hire.save();

            res.status(200).json(updatedHire);
        } catch (error) {
            console.error('Error confirming hire', error);
            res.status(500).json({ error: 'Failed to confirm hire' });
        }
    }

    async deleteHire(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid hire ID' });
            }

            const hire = await hireModel.findByIdAndRemove(id);

            if (!hire) {
                return res.status(404).json({ error: 'Hire not found' });
            }

            return res.status(200).json({ message: 'Hire deleted successfully' });
        } catch (error) {
            console.error('Error deleting hire', error);
            res.status(500).json({ error: 'Failed to delete hire' });
        }
    }

    async getUnconfirmedHires(req, res) {
        try {
            const totalCount = await hireModel.countDocuments({ isCheck: false });

            return res.json({
                totalCount,
            });
        } catch (error) {
            console.error('Error fetching unconfirmed hires', error);
            res.status(500).json({ error: 'Failed to fetch unconfirmed hires' });
        }
    }
}

module.exports = new hireController;