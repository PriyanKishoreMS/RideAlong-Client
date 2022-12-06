const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InactiveRideSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  timestamp: {
    type: Date,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  sourceLat: {
    type: Number,
    required: true,
  },
  sourceLng: {
    type: Number,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  destinationLat: {
    type: Number,
    required: true,
  },
  destinationLng: {
    type: Number,
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
      status: {
        type: Number,
        enum: [0, 1, 2],
        default: 0,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    },
    {timestamps: true},
  ],
});

module.exports = mongoose.model('inactiveride', InactiveRideSchema);
