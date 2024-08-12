const Doctor = require('../models/DoctorSchema');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json({ 
        success: true, 
        doctors, 
        message:"All Doctor is Fetched Successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch doctors' });
  }
};
