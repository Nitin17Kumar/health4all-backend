const express = require('express');
const router = express.Router();

const {bookAppointment, getLatestCode, getSingleUserBooking} = require('../controllers/Booking')
// Route to book an appointment
router.post('/book-appointment', bookAppointment);

// Route to get the latest code
router.get('/latest-code', getLatestCode);

//Route to get the all the booking of the single user
router.get('/allbooking', getSingleUserBooking);

module.exports = router;
