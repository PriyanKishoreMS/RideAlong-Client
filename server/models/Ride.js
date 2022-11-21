const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RideSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  active: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  passengers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
});

module.exports = mongoose.model('ride', RideSchema);
