const User = require('../models/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/DoctorSchema');

exports.signup = async(req, res)=>{
 try {
    const { name, email, password, gender, role } = req.body;
    console.log(name, email, password,gender, role);
    // checking all the detail is successfully fetched

    if(!name || !email || !password || !gender || !role){
        return res.status(400).json({
            success: false,
            message:"All the details are required kindly fill all the detail"
        })    }

    //check is the user is already exist
    const existing_user = await User.findOne({email});

    if(existing_user){
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        }) }

    const hashedPassword = await bcrypt.hash(password, 10);
      
    let user=null;
    // Create a new user based on the role
    if (role === 'patient' ) {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        gender,
        role,
      });
    } else if (role === 'doctor' ) {
      user = await Doctor.create({
        name,
        email,
        password: hashedPassword,
        gender,
        role,
      });
    }
     console.log("role :", role);
     console.log("users :", user);

    return res.status(200).json({
        success: true,
        user,
        message: "Data Successfully Created"
    });
 } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Error in creating User"
    });
 }

}


exports.login = async(req, res)=>{

    try {
       const {email, password } = req.body;
       // checking all the detail is successfully fetched
   
       if(!email || !password ){
           return res.status(400).json({
               success: false,
               message:"All the details are required kindly fill all the detail"
           })    }
   


       
       //check is the user is not present.
       let user = null;

       const patient = await User.findOne({ email });
       const doctor = await Doctor.findOne({ email });

       if (patient) {
           user = patient;
       } else if (doctor) {
           user = doctor;
       }    // here in user all the detail of the user is here
   


       if(!user){
           return res.status(400).json({
               success: false,
               message: 'User is not Present in the database'
           }) }
         

        if(await bcrypt.compare(password, user.password))    // here we are comparing the password typed in email page and hashed password in database.
          {

            const payload = { email:user.email, id: user._id, role:user.role}

            let token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"24h"
            })
            
            var userObject = user.toObject();
            userObject.token = token;
            // user.token=token;
            userObject.password=undefined;
           
          }
          else{
            return res.status(400).json({
                success:false,
                message:" Password do not match kindly enter the correct password "
            })
          }
    
       return res.status(200).json({
           success: true,
           userObject,
           message:"User is successfully logged in"
       });
    } catch (error) {
       console.log(error);
       return res.status(500).json({
           success:false,
           message:"Error in logged in user"
       });
    }
   
   }