const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
  },
  mobile: {
    type: String,
    required: true,
  },
  college: {
    type: String,
  },
  vehicleType: {
    type: String,
  },
  vehicleNumber: {
    type: String,
  },
  vehicleModel: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('profile', ProfileSchema);
