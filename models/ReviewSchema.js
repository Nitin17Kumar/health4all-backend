const mongoose = require('mongoose');
const DoctorSchema = require('./DoctorSchema');

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function(next){
  this.populate({
    path:'user',
    select: "name",   
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (doctorId) {
  // this points the current review
  const stats = await this.aggregate([
  {
  $match: { doctor: doctorId },
  },
  {
  $group: {
  _id: "$doctor",
  numOfRating: {$sum: 1 },
  avgRating: { $avg: "$rating" },
  },
},
]);
 
  await DoctorSchema.findByIdAndUpdate(doctorId,{
    totalRating: stats[0].numOfRating,
    averageRating: stats[0].avgRating
  })
  };
  reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.doctor);
  });

module.exports = mongoose.model("Review", reviewSchema);
