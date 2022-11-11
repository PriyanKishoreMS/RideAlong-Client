const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RideSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  rides: [
    {
      active: {
        type: Boolean,
        default: true,
      },
      date: {
        type: Date,
        required: true,
      },
      source: {
        type: String,
        required: true,
      },
      destination: {
        type: String,
        required: true,
      },
      distance: {
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
          user: {
            type: Schema.Types.ObjectId,
            ref: 'profile',
          },
        },
      ],
    },
  ],
});

module.exports = Ride = mongoose.model('ride', RideSchema);
