const express = require('express');
const app = express();
const database = require('./config/database');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes'); 
const doctorRoutes = require('./routes/doctorRoutes');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;
database.connect();

const userRoute = require('./routes/userRoutes');
app.use(express.json());
app.use(
  cors({
      origin: process.env.CORS_ORIGIN, 
      credentials: true, 
      maxAge: 14400, 
  })
);


app.use('/api/v1/user', userRoute);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/doctor', doctorRoutes);


app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to the API",
    });
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  