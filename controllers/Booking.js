const Booking = require('../models/BookingSchema'); // Adjust the path according to your project structure
const User = require('../models/UserSchema');
const Doctor = require('../models/DoctorSchema');

// Function to generate a unique code
function generateUniqueCode() {
    return Math.random().toString(36).substr(2, 9);
}

// Controller function to handle booking an appointment
exports.bookAppointment = async (req, res) => {
    try {
        const { userId, doctorId, ticketPrice } = req.body;
        console.log(userId, doctorId,ticketPrice);
        if (!userId || !doctorId || !ticketPrice ) {
            return res.status(400).json({
                success: false,
                message: "All details are required. Kindly fill all the details."
            });
        }

        const user = await User.findById(userId);
        const doctor = await Doctor.findById(doctorId);

        if (!user || !doctor) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user or doctor ID'
            });
        }

        // Generate unique code
        const code = generateUniqueCode();

        // Create booking
        const booking = await Booking.create({
            user: userId,
            doctor: doctorId,
            ticketPrice,
            code,
        });

        return res.status(200).json({
            success: true,
            booking,
            message: "Appointment successfully booked"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in booking appointment"
        });
    }
};

// Controller function to get the latest booking code
exports.getLatestCode = async (req, res) => {
    try {
        const latestBooking = await Booking.findOne().sort({ createdAt: -1 });
        if (!latestBooking) {
            return res.status(404).json({
                success: false,
                message: "No bookings found"
            });
        }
        return res.status(200).json({
            success: true,
            code: latestBooking.code
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching latest code"
        });
    }
};


// Controller function to get all bookings for a single user
exports.getSingleUserBooking = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const userBookings = await Booking.find({ user: userId }).populate('doctor', 'name specialty').populate('user', 'name email');

        if (userBookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found for this user"
            });
        }

        return res.status(200).json({
            success: true,
            bookings: userBookings
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching user bookings"
        });
    }
};
