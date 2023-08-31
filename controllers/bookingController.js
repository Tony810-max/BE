const bookingModel = require('../model/booking')

class bookingController {
    async booking(req, res) {
        try {
          const { name, phone, email, date, time, note, count } = req.body;
      
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1;
          const currentDay = currentDate.getDate();
      
          const bookingYear = new Date(date).getFullYear();
          const bookingMonth = new Date(date).getMonth() + 1;
          const bookingDay = new Date(date).getDate();
      
          const bookingTime = new Date(`${date} ${time}`);
          if (bookingTime <= currentDate) {
            throw new Error('Invalid booking date and time');
          }
      
          if (
            bookingYear !== currentYear ||
            (bookingYear === currentYear && bookingMonth < currentMonth) ||
            (bookingYear === currentYear && bookingMonth === currentMonth && bookingDay < currentDay)
          ) {
            throw new Error('Invalid booking date');
          }
      
          const newBooking = new bookingModel({ name, phone, email, date, time, note, count });
          const savedBooking = await newBooking.save();
          res.status(200).json(savedBooking);
        } catch (error) {
          console.error('Error creating booking', error);
          res.status(500).json({ error: 'Failed to create booking' });
        }
      }
      
}

module.exports = new bookingController;